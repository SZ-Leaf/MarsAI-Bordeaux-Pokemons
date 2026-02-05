-- submissionS
CREATE TABLE `submissions` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `cover` VARCHAR(255) NOT NULL,
  `video_url` VARCHAR(255) NOT NULL,
  `english_title` VARCHAR(255) NOT NULL,
  `original_title` VARCHAR(255) NULL,
  `language` VARCHAR(255) NOT NULL,
  `english_synopsis` VARCHAR(300) NOT NULL,
  `original_synopsis` VARCHAR(300) NULL,
  `classification` VARCHAR(255) NOT NULL,
  `tech_stack` VARCHAR(500) NOT NULL,
  `creative_method` VARCHAR(500) NOT NULL,
  `subtitles` VARCHAR(255) NULL,
  `duration_seconds` INT NULL,
  `youtube_URL` VARCHAR(255) NULL,
  `creator_gender` VARCHAR(255) NOT NULL,
  `creator_email` VARCHAR(255) NOT NULL,
  `creator_phone` VARCHAR(30) NULL,
  `creator_mobile` VARCHAR(30) NOT NULL,
  `creator_firstname` VARCHAR(255) NOT NULL,
  `creator_lastname` VARCHAR(255) NOT NULL,
  `creator_country` VARCHAR(255) NOT NULL,
  `creator_address` VARCHAR(255) NOT NULL,
  `referral_source` VARCHAR(255) NOT NULL,
  `terms_of_use` BOOLEAN NOT NULL,
  `moderation_id` INT UNIQUE NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE `submission_moderation` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `status` VARCHAR(50) NOT NULL,
  `details` VARCHAR(500) NULL,
  `user_id` INT NOT NULL,
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE `selector_memo` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `rating` INT NULL,
  `comment` VARCHAR(255) NULL,
  `selection_list` VARCHAR(255) NULL,
  `user_id` INT NOT NULL,
  `submission_id` INT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE `gallery` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `filename` VARCHAR(255) NOT NULL,
  `submission_id` INT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE `tags` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) UNIQUE NOT NULL
);
CREATE TABLE `awards` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `rank` INT NOT NULL,
  `cover` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE `sponsors` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `cover` VARCHAR(255) NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE `collaborators` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `firstname` VARCHAR(255) NOT NULL,
  `lastname` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  -- `profession` VARCHAR(255) NOT NULL,
  `gender` VARCHAR(255) NOT NULL,
  `role` VARCHAR(500) NOT NULL,
  `submission_id` INT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- USERS
CREATE TABLE `users` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `firstname` VARCHAR(255) NOT NULL,
  `lastname` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `last_login` DATETIME NULL,
  `role_id` INT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE `roles` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) UNIQUE NOT NULL
);
CREATE TABLE `invites` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `role_id` INT NOT NULL,
  `token` VARCHAR(255) NOT NULL UNIQUE,
  `registered` DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE `reset_password_tokens` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `token` VARCHAR(255) NOT NULL UNIQUE,
  `used_at` DATETIME NULL,
  `expires_at` DATETIME NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- EVENTS
CREATE TABLE `events` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `cover` VARCHAR(500) NULL,
  `description` TEXT NOT NULL,
  `start_date` DATETIME NOT NULL,
  `end_date` DATETIME NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `places` INT NOT NULL,
  `user_id` INT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE `reservations` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(255) NOT NULL,
  `last_name` VARCHAR(255) NOT NULL,
  `confirmation` DATETIME NULL,
  `email` VARCHAR(255) NOT NULL,
  `event_id` INT NOT NULL,
  `qr_code` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- NEWSLETTER
CREATE TABLE `newsletter` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255),
  `content` TEXT NOT NULL,
  `user_id` INT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE `newsletter_listings` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- SOCIALS
CREATE TABLE `socials` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `url` VARCHAR(500) NOT NULL,
  `submission_id` INT NOT NULL,
  `network_id` INT NOT NULL
);
CREATE TABLE `social_networks` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `logo` VARCHAR(500) NOT NULL
);

-- CMS TABLES
CREATE TABLE `sections_cms` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `title` VARCHAR(255) NULL,
  `subtitle` VARCHAR(255) NULL,
  `content` TEXT NULL,
  `map_url` VARCHAR(500) NULL,
  `visibility` BOOLEAN,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- CREATE TABLE `theme_cms` (
--   `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
--   `primary_color` VARCHAR(255) NOT NULL,
--   `secondary_color` VARCHAR(255) NOT NULL,
--   `accent_color` VARCHAR(255) NOT NULL,
--   `primary_font_color` VARCHAR(255) NOT NULL,
--   `secondary_font_color` VARCHAR(255) NOT NULL,
--   `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
-- );
CREATE TABLE `general_cms` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `submissions_end_date` DATE NOT NULL,
  -- `theme_id` INT NOT NULL,
  `city` VARCHAR(255) NOT NULL,
  `address` VARCHAR(255) NULL
);
CREATE TABLE `cards_cms` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NULL,
  `content` TEXT NULL,
  `card_icon_filename` VARCHAR(255) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ASSOCIATIVE TABLES
CREATE TABLE `submissions_tags` (
  `submission_id` INT NOT NULL,
  `tag_id` INT NOT NULL,
  PRIMARY KEY (`submission_id`, `tag_id`)
);
CREATE TABLE `submissions_awards` (
  `submission_id` INT NOT NULL,
  `award_id` INT NOT NULL,
  PRIMARY KEY (`submission_id`, `award_id`)
);


-- FOREIGN KEY CONSTRAINTS

-- SUBMISSIONS TABLE
ALTER TABLE `submissions` ADD CONSTRAINT fk_submissions_moderation_id FOREIGN KEY (`moderation_id`) REFERENCES `submission_moderation` (`id`);
-- SUBMISSION_MODERATION TABLE
ALTER TABLE `submission_moderation` ADD CONSTRAINT fk_submission_moderation_user_id FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
-- SELECTOR_MEMO TABLE
ALTER TABLE `selector_memo` ADD CONSTRAINT fk_selector_memo_user_id FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
ALTER TABLE `selector_memo` ADD CONSTRAINT fk_selector_memo_submission_id FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`);
-- GALLERY TABLE
ALTER TABLE `gallery` ADD CONSTRAINT fk_gallery_submission_id FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`);
-- COLLABORATORS TABLE
ALTER TABLE `collaborators` ADD CONSTRAINT fk_collaborators_submission_id FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`);
-- USERS TABLE
ALTER TABLE `users` ADD CONSTRAINT fk_user_role_id FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);
-- INVITES TABLE
ALTER TABLE `invites` ADD CONSTRAINT fk_invites_role_id FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);
-- EVENTS TABLE
ALTER TABLE `events` ADD CONSTRAINT fk_events_user_id FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
-- RESERVATIONS TABLE
ALTER TABLE `reservations` ADD CONSTRAINT fk_reservations_event_id FOREIGN KEY (`event_id`) REFERENCES `events` (`id`);
-- NEWSLETTER TABLE
ALTER TABLE `newsletter` ADD CONSTRAINT fk_newsletter_user_id FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
-- SOCIALS TABLE
ALTER TABLE `socials` ADD CONSTRAINT fk_socials_submission_id FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`);
ALTER TABLE `socials` ADD CONSTRAINT fk_socials_network_id FOREIGN KEY (`network_id`) REFERENCES `social_networks` (`id`);
-- GENERAL CMS TABLE
-- ALTER TABLE `general_cms` ADD CONSTRAINT fk_general_cms_theme_id FOREIGN KEY (`theme_id`) REFERENCES `theme_cms` (`id`);
-- UNIQUE INDEXE FOR RESERVATIONS TABLE
CREATE UNIQUE INDEX unique_reservation_email_event ON reservations (email, event_id);
-- UNIQUE INDEXES FOR INVITES TABLE
CREATE UNIQUE INDEX unique_invite_email ON invites (email);
CREATE UNIQUE INDEX unique_invite_token ON invites (token);

-- ASSOCIATIVE TABLES

-- SUBMISSIONS-TAGS ASSOCIATIVE TABLE
ALTER TABLE `submissions_tags` ADD CONSTRAINT fk_submissions_tags_submission_id FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`);
ALTER TABLE `submissions_tags` ADD CONSTRAINT fk_submissions_tags_tag_id FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`);
-- SUBMISSIONS-AWARDS ASSOCIATIVE TABLE
ALTER TABLE `submissions_awards` ADD CONSTRAINT fk_submissions_awards_submission_id FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`);
ALTER TABLE `submissions_awards` ADD CONSTRAINT fk_submissions_awards_award_id FOREIGN KEY (`award_id`) REFERENCES `awards` (`id`);


-- UNIQUE INDEXES
CREATE UNIQUE INDEX `unique_selector_memo_rating` ON `selector_memo` (`submission_id`, `user_id`);

-- FK INDEXES
CREATE INDEX idx_submissions_moderation_id ON submissions(moderation_id);
CREATE INDEX idx_submission_moderation_user_id ON submission_moderation(user_id);
CREATE INDEX idx_selector_memo_user_id ON selector_memo(user_id);
CREATE INDEX idx_selector_memo_submission_id ON selector_memo(submission_id);
CREATE INDEX idx_gallery_submission_id ON gallery(submission_id);
CREATE INDEX idx_collaborators_submission_id ON collaborators(submission_id);
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_reservations_event_id ON reservations(event_id);
CREATE INDEX idx_newsletter_user_id ON newsletter(user_id);
CREATE INDEX idx_socials_submission_id ON socials(submission_id);
CREATE INDEX idx_socials_network_id ON socials(network_id);
-- CREATE INDEX idx_general_cms_theme_id ON general_cms(theme_id);

-- ASSOCIATIVE KEY INDEXES
CREATE INDEX idx_submissions_tags_submission_id ON submissions_tags(submission_id);
CREATE INDEX idx_submissions_tags_tag_id ON submissions_tags(tag_id);
CREATE INDEX idx_submissions_awards_submission_id ON submissions_awards(submission_id);
CREATE INDEX idx_submissions_awards_award_id ON submissions_awards(award_id);


INSERT INTO roles (`title`) VALUES ('user'), ('admin');
INSERT INTO social_networks (`title`, `logo`) VALUES ('fb', 'fb-logl'), ('ig', 'ig-logo'), ('linkedin', 'lkin-logo'), ('x', 'x-logo'), ('tiktok', 'tiktok-logo'), ('website', 'website-logo');