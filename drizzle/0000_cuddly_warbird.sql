CREATE TABLE `chats` (
	`id` integer PRIMARY KEY NOT NULL,
	`chatName` text,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP,
	`user_id` integer,
	`content` text DEFAULT (json_array()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`username` text,
	`password` text,
	`port` integer,
	`system_template` text,
	`seed` text,
	`temperature` integer,
	`topP` integer,
	`topK` integer,
	`contextAmount` integer,
	`selectedModel` text
);
