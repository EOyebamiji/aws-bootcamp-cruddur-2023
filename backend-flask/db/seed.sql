-- this file was manually created
INSERT INTO public.users (display_name, email, handle, cognito_user_id)
VALUES
  ('Emmanuel Oyebamiji', 'Emmanueloluwatosin56@gmail.com', 'EOyebamiji' ,'MOCK'),
  ('Andrew Browm', 'andrew@exampro.co', 'andrewbrown', 'MOCK'),
  ('Andrew Bayko', 'bayko@exampro.co', 'bayko', 'MOCK');

INSERT INTO public.activities (user_uuid, message, expires_at)
VALUES
  (
    (SELECT uuid from public.users WHERE users.handle = 'EOyebamiji' LIMIT 1),
    'This was imported as seed data!',
    current_timestamp + interval '10 day'
  )