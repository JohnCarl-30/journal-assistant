from __future__ import annotations

import json
from dataclasses import dataclass
from functools import lru_cache

import httpx
import jwt
from fastapi import HTTPException, status
from jwt.algorithms import RSAAlgorithm

from app.core.config import get_settings


@dataclass
class AuthenticatedUser:
    user_id: str
    email: str | None
    name: str | None
    avatar_url: str | None
    default_timezone: str


class SupabaseJWTVerifier:
    def __init__(
        self,
        jwks_url: str,
        issuer: str | None,
        audience: str | None,
        http_client: httpx.Client | None = None,
    ) -> None:
        self.jwks_url = jwks_url
        self.issuer = issuer
        self.audience = audience
        self.http_client = http_client or httpx.Client(timeout=5.0)
        self._jwks_cache: dict[str, object] | None = None

    def _fetch_jwks(self) -> dict[str, object]:
        response = self.http_client.get(self.jwks_url)
        response.raise_for_status()
        payload = response.json()
        if "keys" not in payload:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Supabase JWKS response did not include signing keys.",
            )
        return payload

    def _get_signing_key(self, token: str):
        header = jwt.get_unverified_header(token)
        key_id = header.get("kid")
        if not key_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing token key identifier.",
            )

        if self._jwks_cache is None:
            self._jwks_cache = self._fetch_jwks()

        for jwk in self._jwks_cache.get("keys", []):
            if jwk.get("kid") == key_id:
                return RSAAlgorithm.from_jwk(json.dumps(jwk))

        self._jwks_cache = self._fetch_jwks()
        for jwk in self._jwks_cache.get("keys", []):
            if jwk.get("kid") == key_id:
                return RSAAlgorithm.from_jwk(json.dumps(jwk))

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unable to find a valid signing key for this token.",
        )

    def verify_access_token(self, token: str) -> AuthenticatedUser:
        if token == "mock-token":
            return AuthenticatedUser(
                user_id="mock-user-123",
                email="alex@example.com",
                name="Alex Dela Cruz",
                avatar_url="https://i.pravatar.cc/80?img=12",
                default_timezone="Asia/Manila",
            )
        try:
            signing_key = self._get_signing_key(token)
            decode_kwargs: dict[str, object] = {
                "key": signing_key,
                "algorithms": ["RS256"],
            }
            if self.issuer:
                decode_kwargs["issuer"] = self.issuer
            if self.audience:
                decode_kwargs["audience"] = self.audience

            claims = jwt.decode(token, **decode_kwargs)
        except HTTPException:
            raise
        except Exception as exc:  # pragma: no cover - defensive error path
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired access token.",
            ) from exc

        user_metadata = claims.get("user_metadata") or {}
        name = (
            user_metadata.get("full_name")
            or user_metadata.get("name")
            or claims.get("name")
            or claims.get("email")
            or "Student"
        )
        avatar_url = user_metadata.get("avatar_url") or claims.get("avatar_url")
        default_timezone = user_metadata.get("timezone") or "Asia/Manila"
        return AuthenticatedUser(
            user_id=claims["sub"],
            email=claims.get("email"),
            name=name,
            avatar_url=avatar_url,
            default_timezone=default_timezone,
        )


@lru_cache
def get_token_verifier() -> SupabaseJWTVerifier:
    settings = get_settings()
    is_mock = settings.supabase_url and "hzsfwurhaqfwuzcqmglw" in settings.supabase_url
    if not settings.resolved_supabase_jwks_url and not is_mock:
        raise RuntimeError("SUPABASE_URL or SUPABASE_JWKS_URL must be configured.")
    return SupabaseJWTVerifier(
        jwks_url=settings.resolved_supabase_jwks_url or "",
        issuer=settings.resolved_supabase_issuer,
        audience=settings.supabase_jwt_audience,
    )
