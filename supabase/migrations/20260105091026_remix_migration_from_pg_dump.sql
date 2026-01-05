CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
BEGIN;

--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$;


--
-- Name: update_conversation_timestamp(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_conversation_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


--
-- Name: update_goal_progress(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_goal_progress() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Update completed_count for all goals linked to this habit
  UPDATE public.goals g
  SET completed_count = (
    SELECT COALESCE(SUM(hc.value), 0)
    FROM public.goal_habits gh
    JOIN public.habit_completions hc ON hc.habit_id = gh.habit_id
    WHERE gh.goal_id = g.id
    AND hc.date >= g.start_date
    AND hc.date <= g.end_date
  ),
  status = CASE 
    WHEN (
      SELECT COALESCE(SUM(hc.value), 0)
      FROM public.goal_habits gh
      JOIN public.habit_completions hc ON hc.habit_id = gh.habit_id
      WHERE gh.goal_id = g.id
      AND hc.date >= g.start_date
      AND hc.date <= g.end_date
    ) >= g.target_count THEN 'completed'
    ELSE 'active'
  END
  WHERE g.id IN (
    SELECT gh.goal_id FROM public.goal_habits gh WHERE gh.habit_id = NEW.habit_id
  );
  RETURN NEW;
END;
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: ai_usage; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_usage (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    message_count integer DEFAULT 0 NOT NULL,
    month_year text NOT NULL,
    last_message_date date DEFAULT CURRENT_DATE NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    voice_seconds_used integer DEFAULT 0 NOT NULL,
    voice_last_date date DEFAULT CURRENT_DATE NOT NULL,
    voice_seconds_today integer DEFAULT 0 NOT NULL
);


--
-- Name: chat_conversations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chat_conversations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    title text DEFAULT 'New conversation'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: chat_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chat_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role text NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    conversation_id uuid,
    CONSTRAINT chat_messages_role_check CHECK ((role = ANY (ARRAY['user'::text, 'assistant'::text])))
);


--
-- Name: daily_todos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.daily_todos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    date date NOT NULL,
    text text NOT NULL,
    completed boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: goal_habits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.goal_habits (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    goal_id uuid NOT NULL,
    habit_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: goals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.goals (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    category_emoji text DEFAULT '🎯'::text NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    target_count integer NOT NULL,
    completed_count integer DEFAULT 0 NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT goals_duration_check CHECK ((end_date >= (start_date + '3 mons'::interval))),
    CONSTRAINT goals_status_check CHECK ((status = ANY (ARRAY['active'::text, 'completed'::text])))
);


--
-- Name: habit_completions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.habit_completions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    habit_id uuid NOT NULL,
    user_id uuid NOT NULL,
    date date NOT NULL,
    value integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: habits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.habits (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    name text NOT NULL,
    icon text DEFAULT '✨'::text NOT NULL,
    category text DEFAULT 'Other'::text NOT NULL,
    category_color text,
    target integer DEFAULT 1 NOT NULL,
    importance integer DEFAULT 50,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: journal_entries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.journal_entries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    content text NOT NULL,
    emoji text DEFAULT '😊'::text,
    bg_color text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: mood_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mood_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    date date NOT NULL,
    mood integer,
    motivation integer,
    reflection text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT mood_logs_mood_check CHECK (((mood >= 1) AND (mood <= 10))),
    CONSTRAINT mood_logs_motivation_check CHECK (((motivation >= 1) AND (motivation <= 10)))
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    email text,
    full_name text,
    avatar_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: ai_usage ai_usage_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_usage
    ADD CONSTRAINT ai_usage_pkey PRIMARY KEY (id);


--
-- Name: ai_usage ai_usage_user_id_month_year_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_usage
    ADD CONSTRAINT ai_usage_user_id_month_year_key UNIQUE (user_id, month_year);


--
-- Name: chat_conversations chat_conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_conversations
    ADD CONSTRAINT chat_conversations_pkey PRIMARY KEY (id);


--
-- Name: chat_messages chat_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_pkey PRIMARY KEY (id);


--
-- Name: daily_todos daily_todos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_todos
    ADD CONSTRAINT daily_todos_pkey PRIMARY KEY (id);


--
-- Name: goal_habits goal_habits_goal_id_habit_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.goal_habits
    ADD CONSTRAINT goal_habits_goal_id_habit_id_key UNIQUE (goal_id, habit_id);


--
-- Name: goal_habits goal_habits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.goal_habits
    ADD CONSTRAINT goal_habits_pkey PRIMARY KEY (id);


--
-- Name: goals goals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.goals
    ADD CONSTRAINT goals_pkey PRIMARY KEY (id);


--
-- Name: habit_completions habit_completions_habit_id_date_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.habit_completions
    ADD CONSTRAINT habit_completions_habit_id_date_key UNIQUE (habit_id, date);


--
-- Name: habit_completions habit_completions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.habit_completions
    ADD CONSTRAINT habit_completions_pkey PRIMARY KEY (id);


--
-- Name: habits habits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.habits
    ADD CONSTRAINT habits_pkey PRIMARY KEY (id);


--
-- Name: journal_entries journal_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.journal_entries
    ADD CONSTRAINT journal_entries_pkey PRIMARY KEY (id);


--
-- Name: mood_logs mood_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mood_logs
    ADD CONSTRAINT mood_logs_pkey PRIMARY KEY (id);


--
-- Name: mood_logs mood_logs_user_id_date_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mood_logs
    ADD CONSTRAINT mood_logs_user_id_date_key UNIQUE (user_id, date);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: idx_daily_todos_user_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_daily_todos_user_date ON public.daily_todos USING btree (user_id, date);


--
-- Name: ai_usage update_ai_usage_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_ai_usage_updated_at BEFORE UPDATE ON public.ai_usage FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: chat_conversations update_chat_conversations_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_chat_conversations_updated_at BEFORE UPDATE ON public.chat_conversations FOR EACH ROW EXECUTE FUNCTION public.update_conversation_timestamp();


--
-- Name: habit_completions update_goal_progress_on_completion; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_goal_progress_on_completion AFTER INSERT OR DELETE OR UPDATE ON public.habit_completions FOR EACH ROW EXECUTE FUNCTION public.update_goal_progress();


--
-- Name: goals update_goals_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON public.goals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: habits update_habits_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_habits_updated_at BEFORE UPDATE ON public.habits FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: journal_entries update_journal_entries_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_journal_entries_updated_at BEFORE UPDATE ON public.journal_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: profiles update_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: chat_messages chat_messages_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.chat_conversations(id) ON DELETE CASCADE;


--
-- Name: goal_habits goal_habits_goal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.goal_habits
    ADD CONSTRAINT goal_habits_goal_id_fkey FOREIGN KEY (goal_id) REFERENCES public.goals(id) ON DELETE CASCADE;


--
-- Name: goal_habits goal_habits_habit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.goal_habits
    ADD CONSTRAINT goal_habits_habit_id_fkey FOREIGN KEY (habit_id) REFERENCES public.habits(id) ON DELETE CASCADE;


--
-- Name: habit_completions habit_completions_habit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.habit_completions
    ADD CONSTRAINT habit_completions_habit_id_fkey FOREIGN KEY (habit_id) REFERENCES public.habits(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: habit_completions Users can create their own completions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own completions" ON public.habit_completions FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: chat_conversations Users can create their own conversations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own conversations" ON public.chat_conversations FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: goal_habits Users can create their own goal habits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own goal habits" ON public.goal_habits FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: goals Users can create their own goals; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own goals" ON public.goals FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: habits Users can create their own habits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own habits" ON public.habits FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: journal_entries Users can create their own journals; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own journals" ON public.journal_entries FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: chat_messages Users can create their own messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own messages" ON public.chat_messages FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: mood_logs Users can create their own mood logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own mood logs" ON public.mood_logs FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: daily_todos Users can create their own todos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own todos" ON public.daily_todos FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: habit_completions Users can delete their own completions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own completions" ON public.habit_completions FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: chat_conversations Users can delete their own conversations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own conversations" ON public.chat_conversations FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: goal_habits Users can delete their own goal habits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own goal habits" ON public.goal_habits FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: goals Users can delete their own goals; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own goals" ON public.goals FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: habits Users can delete their own habits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own habits" ON public.habits FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: journal_entries Users can delete their own journals; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own journals" ON public.journal_entries FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: chat_messages Users can delete their own messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own messages" ON public.chat_messages FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: mood_logs Users can delete their own mood logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own mood logs" ON public.mood_logs FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: daily_todos Users can delete their own todos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own todos" ON public.daily_todos FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: profiles Users can insert their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = id));


--
-- Name: ai_usage Users can insert their own usage; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own usage" ON public.ai_usage FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: habit_completions Users can update their own completions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own completions" ON public.habit_completions FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: chat_conversations Users can update their own conversations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own conversations" ON public.chat_conversations FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: goals Users can update their own goals; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own goals" ON public.goals FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: habits Users can update their own habits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own habits" ON public.habits FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: journal_entries Users can update their own journals; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own journals" ON public.journal_entries FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: mood_logs Users can update their own mood logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own mood logs" ON public.mood_logs FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: profiles Users can update their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = id));


--
-- Name: daily_todos Users can update their own todos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own todos" ON public.daily_todos FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: ai_usage Users can update their own usage; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own usage" ON public.ai_usage FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: habit_completions Users can view their own completions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own completions" ON public.habit_completions FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: chat_conversations Users can view their own conversations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own conversations" ON public.chat_conversations FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: goal_habits Users can view their own goal habits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own goal habits" ON public.goal_habits FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: goals Users can view their own goals; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own goals" ON public.goals FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: habits Users can view their own habits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own habits" ON public.habits FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: journal_entries Users can view their own journals; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own journals" ON public.journal_entries FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: chat_messages Users can view their own messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own messages" ON public.chat_messages FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: mood_logs Users can view their own mood logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own mood logs" ON public.mood_logs FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: profiles Users can view their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING ((auth.uid() = id));


--
-- Name: daily_todos Users can view their own todos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own todos" ON public.daily_todos FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: ai_usage Users can view their own usage; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own usage" ON public.ai_usage FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: ai_usage; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;

--
-- Name: chat_conversations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

--
-- Name: chat_messages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

--
-- Name: daily_todos; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.daily_todos ENABLE ROW LEVEL SECURITY;

--
-- Name: goal_habits; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.goal_habits ENABLE ROW LEVEL SECURITY;

--
-- Name: goals; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

--
-- Name: habit_completions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;

--
-- Name: habits; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;

--
-- Name: journal_entries; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: mood_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.mood_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--




COMMIT;