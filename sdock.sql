--
-- PostgreSQL database dump
--

-- Dumped from database version 12.3
-- Dumped by pg_dump version 12.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: session; Type: TABLE; Schema: public; Owner: my_user
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO my_user;

--
-- Name: users; Type: TABLE; Schema: public; Owner: my_user
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    first_name character varying(30),
    last_name character varying(30),
    email character varying(50) NOT NULL,
    password character varying(60) NOT NULL
);


ALTER TABLE public.users OWNER TO my_user;

--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: my_user
--

COPY public.session (sid, sess, expire) FROM stdin;
Vp6HTj8LOwuf_pB6AEnkBvgLWCbfCwml	{"cookie":{"originalMaxAge":1209600000,"expires":"2020-08-21T15:41:08.087Z","httpOnly":true,"path":"/"}}	2020-08-22 18:22:32
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: my_user
--

COPY public.users (id, first_name, last_name, email, password) FROM stdin;
f740022f-68f9-498f-b414-d8398d1796c9	lease	ret	lizret@yahoo.com	$2b$10$WKZHJLMCby2CFTk98C3xWOETDknl0Udxle.LB/l1gTji1MqVXiSG6
\.


--
-- Name: users email_unique; Type: CONSTRAINT; Schema: public; Owner: my_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT email_unique UNIQUE (email);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: my_user
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: my_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: my_user
--

CREATE INDEX "IDX_session_expire" ON public.session USING btree (expire);


--
-- PostgreSQL database dump complete
--

