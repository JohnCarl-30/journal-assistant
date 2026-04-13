export type ProfileDTO = {
  user_id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  default_timezone: string;
  school_name: string | null;
  program: string | null;
};

export type InternshipTermDTO = {
  id: string;
  user_id: string;
  company: string;
  supervisor: string;
  role_title: string;
  start_date: string;
  end_date: string;
  target_hours: number;
  report_title: string | null;
  is_active: boolean;
};

export type WorkDayDTO = {
  id: string;
  user_id: string;
  work_date: string;
  time_in_local: string | null;
  time_out_local: string | null;
  timezone: string;
  total_minutes: number;
  entry_ids: string[];
  dtr_narrative_document_id: string | null;
};

export type JournalEntryDTO = {
  id: string;
  user_id: string;
  work_date: string;
  title: string;
  content_md: string;
  source_type: string;
  created_at: string;
  updated_at: string;
};
