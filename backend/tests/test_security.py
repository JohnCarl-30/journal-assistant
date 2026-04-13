import json
import unittest
from datetime import datetime, timedelta, timezone

import httpx
import jwt
from cryptography.hazmat.primitives.asymmetric import rsa
from jwt.algorithms import RSAAlgorithm

from app.core.security import SupabaseJWTVerifier


class SupabaseJwtVerifierTests(unittest.TestCase):
    def test_verifies_token_with_mocked_jwks(self) -> None:
        private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
        public_key = private_key.public_key()
        jwk = json.loads(RSAAlgorithm.to_jwk(public_key))
        jwk["kid"] = "test-key"

        transport = httpx.MockTransport(
            lambda request: httpx.Response(200, json={"keys": [jwk]}),
        )
        http_client = httpx.Client(transport=transport)

        verifier = SupabaseJWTVerifier(
            jwks_url="https://example.supabase.co/auth/v1/.well-known/jwks.json",
            issuer="https://example.supabase.co/auth/v1",
            audience="authenticated",
            http_client=http_client,
        )

        now = datetime.now(timezone.utc)
        token = jwt.encode(
            {
                "sub": "user-123",
                "email": "student@example.com",
                "aud": "authenticated",
                "iss": "https://example.supabase.co/auth/v1",
                "iat": int(now.timestamp()),
                "exp": int((now + timedelta(minutes=10)).timestamp()),
                "user_metadata": {
                    "full_name": "Student Example",
                    "timezone": "Asia/Manila",
                },
            },
            private_key,
            algorithm="RS256",
            headers={"kid": "test-key"},
        )

        user = verifier.verify_access_token(token)

        self.assertEqual(user.user_id, "user-123")
        self.assertEqual(user.email, "student@example.com")
        self.assertEqual(user.name, "Student Example")
        self.assertEqual(user.default_timezone, "Asia/Manila")


if __name__ == "__main__":
    unittest.main()
