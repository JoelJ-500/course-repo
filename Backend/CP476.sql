CREATE TABLE IF NOT EXISTS `Users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `Users_UNIQUE` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='List of users';

CREATE TABLE IF NOT EXISTS `Courses` (
  `course_id` int(11) NOT NULL AUTO_INCREMENT,
  `course_code` varchar(20) DEFAULT NULL,
  `course_title` varchar(100) DEFAULT NULL,
  `professor_name` varchar(100) DEFAULT NULL,
  `university_name` varchar(100) DEFAULT NULL,
  `last_updated_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='List of courses';

CREATE TABLE IF NOT EXISTS `CourseFiles` (
  `file_id` int(11) NOT NULL AUTO_INCREMENT,
  `course_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `category` enum('outline','midterm_real','midterm_mock','final_real','final_mock','misc') DEFAULT NULL,
  `display_name` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `stored_path` varchar(255) DEFAULT NULL,
  `uploaded_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`file_id`),
  KEY `CourseFiles_Courses_FK` (`course_id`),
  KEY `CourseFiles_Users_FK` (`user_id`),
  CONSTRAINT `CourseFiles_Courses_FK` FOREIGN KEY (`course_id`) REFERENCES `Courses` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `CourseFiles_Users_FK` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Uploaded course files';

CREATE TABLE IF NOT EXISTS `SavedItems` (
  `saved_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `course_id` int(11) DEFAULT NULL,
  `file_id` int(11) DEFAULT NULL,
  `saved_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`saved_id`),
  KEY `SavedItems_Users_FK` (`user_id`),
  KEY `SavedItems_Courses_FK` (`course_id`),
  KEY `SavedItems_CourseFiles_FK` (`file_id`),
  CONSTRAINT `SavedItems_CourseFiles_FK` FOREIGN KEY (`file_id`) REFERENCES `CourseFiles` (`file_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `SavedItems_Courses_FK` FOREIGN KEY (`course_id`) REFERENCES `Courses` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `SavedItems_Users_FK` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Users saved files';
