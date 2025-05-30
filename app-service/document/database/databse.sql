-- MySQL Script generated by MySQL Workbench
-- Mon Apr 28 15:35:24 2025
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema app_db
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema app_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `app_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `app_db` ;

-- -----------------------------------------------------
-- Table `app_db`.`publishers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `app_db`.`publishers` (
  `id` VARCHAR(255) NOT NULL,
  `address` VARCHAR(100) NOT NULL,
  `created_at` DATETIME(6) NULL DEFAULT NULL,
  `created_by` VARCHAR(255) NULL DEFAULT NULL,
  `name` VARCHAR(100) NOT NULL,
  `note` VARCHAR(500) NULL DEFAULT NULL,
  `updated_at` DATETIME(6) NULL DEFAULT NULL,
  `updated_by` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `UKan1ucpx8sw2qm194mlok8e5us` (`name` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `app_db`.`books`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `app_db`.`books` (
  `sku` VARCHAR(20) NOT NULL,
  `created_at` DATETIME(6) NULL DEFAULT NULL,
  `created_by` VARCHAR(255) NULL DEFAULT NULL,
  `description` VARCHAR(2000) NULL DEFAULT NULL,
  `discount` INT NOT NULL,
  `form` INT NOT NULL,
  `isbn` VARCHAR(13) NULL DEFAULT NULL,
  `page_number` INT NOT NULL,
  `publish_year` INT NOT NULL,
  `selling_price` DOUBLE NOT NULL,
  `sold_quantity` INT NOT NULL,
  `status` INT NULL DEFAULT NULL,
  `stock_quantity` INT NOT NULL,
  `title` VARCHAR(100) NOT NULL,
  `updated_at` DATETIME(6) NULL DEFAULT NULL,
  `updated_by` VARCHAR(255) NULL DEFAULT NULL,
  `weight` INT NOT NULL,
  `publisher_id` VARCHAR(255) NULL DEFAULT NULL,
  `final_price` DOUBLE NOT NULL,
  `import_price` DOUBLE NOT NULL,
  `profit` INT NOT NULL,
  `authors` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`sku`),
  UNIQUE INDEX `UK5mtto2jcmfrwfg0p1ui8mnweu` (`title` ASC) VISIBLE,
  UNIQUE INDEX `UKkibbepcitr0a3cpk3rfr7nihn` (`isbn` ASC) VISIBLE,
  INDEX `FKayy5edfrqnegqj3882nce6qo8` (`publisher_id` ASC) VISIBLE,
  CONSTRAINT `FKayy5edfrqnegqj3882nce6qo8`
    FOREIGN KEY (`publisher_id`)
    REFERENCES `app_db`.`publishers` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `app_db`.`files`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `app_db`.`files` (
  `id` VARCHAR(255) NOT NULL,
  `folder` VARCHAR(255) NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `book_sku` VARCHAR(20) NULL DEFAULT NULL,
  `category_id` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `UK1ubnbuwmuxyjffgok53oxvlk9` (`category_id` ASC) VISIBLE,
  INDEX `FKdqb73lg09ww7301mdsgfhapuj` (`book_sku` ASC) VISIBLE,
  CONSTRAINT `FK6xloaa7akbr4huuv2ng03ygc`
    FOREIGN KEY (`category_id`)
    REFERENCES `app_db`.`categories` (`id`),
  CONSTRAINT `FKdqb73lg09ww7301mdsgfhapuj`
    FOREIGN KEY (`book_sku`)
    REFERENCES `app_db`.`books` (`sku`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `app_db`.`categories`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `app_db`.`categories` (
  `id` VARCHAR(255) NOT NULL,
  `created_at` DATETIME(6) NULL DEFAULT NULL,
  `created_by` VARCHAR(255) NULL DEFAULT NULL,
  `name` VARCHAR(100) NOT NULL,
  `symbol` VARCHAR(10) NOT NULL,
  `updated_at` DATETIME(6) NULL DEFAULT NULL,
  `updated_by` VARCHAR(255) NULL DEFAULT NULL,
  `file_id` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `UKt8o6pivur7nn124jehx7cygw5` (`name` ASC) VISIBLE,
  UNIQUE INDEX `UK80kqod0rnvnu7002a9r0ny9nr` (`symbol` ASC) VISIBLE,
  UNIQUE INDEX `UK1t4wtsbgqbb39y716tvyv2y6o` (`file_id` ASC) VISIBLE,
  CONSTRAINT `FKaubw31p22279qr7pldduq7rdx`
    FOREIGN KEY (`file_id`)
    REFERENCES `app_db`.`files` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `app_db`.`book_categories`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `app_db`.`book_categories` (
  `book_sku` VARCHAR(20) NOT NULL,
  `category_id` VARCHAR(255) NOT NULL,
  INDEX `FKrg2xlmc92mm2y5b1wmhd2g0y0` (`category_id` ASC) VISIBLE,
  INDEX `FKr70fy4c5bvwajeajd6ak2n2bu` (`book_sku` ASC) VISIBLE,
  CONSTRAINT `FKr70fy4c5bvwajeajd6ak2n2bu`
    FOREIGN KEY (`book_sku`)
    REFERENCES `app_db`.`books` (`sku`),
  CONSTRAINT `FKrg2xlmc92mm2y5b1wmhd2g0y0`
    FOREIGN KEY (`category_id`)
    REFERENCES `app_db`.`categories` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `app_db`.`suppliers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `app_db`.`suppliers` (
  `id` VARCHAR(255) NOT NULL,
  `address` VARCHAR(100) NOT NULL,
  `created_at` DATETIME(6) NULL DEFAULT NULL,
  `created_by` VARCHAR(255) NULL DEFAULT NULL,
  `name` VARCHAR(100) NOT NULL,
  `note` VARCHAR(500) NULL DEFAULT NULL,
  `tax_code` VARCHAR(13) NOT NULL,
  `updated_at` DATETIME(6) NULL DEFAULT NULL,
  `updated_by` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `UKeegixpn11chp14nb25tl3ucv0` (`name` ASC) VISIBLE,
  UNIQUE INDEX `UKmfdrwfxx7lukt56sde78ol26c` (`tax_code` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `app_db`.`book_exports`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `app_db`.`book_exports` (
  `id` VARCHAR(20) NOT NULL,
  `created_at` DATETIME(6) NULL DEFAULT NULL,
  `created_by` VARCHAR(255) NULL DEFAULT NULL,
  `note` VARCHAR(200) NULL DEFAULT NULL,
  `reason` VARCHAR(200) NULL DEFAULT NULL,
  `status` BIT(1) NOT NULL,
  `total_cost` DOUBLE NOT NULL,
  `updated_at` DATETIME(6) NULL DEFAULT NULL,
  `updated_by` VARCHAR(255) NULL DEFAULT NULL,
  `supplier_id` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `FKmoc6rouxb025mjehva1bs6af3` (`supplier_id` ASC) VISIBLE,
  CONSTRAINT `FKmoc6rouxb025mjehva1bs6af3`
    FOREIGN KEY (`supplier_id`)
    REFERENCES `app_db`.`suppliers` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `app_db`.`book_export_items`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `app_db`.`book_export_items` (
  `id` VARCHAR(255) NOT NULL,
  `quantity` INT NOT NULL,
  `total_cost` DOUBLE NOT NULL,
  `unit_price` DOUBLE NOT NULL,
  `book_sku` VARCHAR(20) NOT NULL,
  `book_export_id` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `FK8cr5xyqma3aq9ttfxd50nqpor` (`book_sku` ASC) VISIBLE,
  INDEX `FK8ud3ggbyyjj1ra4ctrwkmbdjd` (`book_export_id` ASC) VISIBLE,
  CONSTRAINT `FK8cr5xyqma3aq9ttfxd50nqpor`
    FOREIGN KEY (`book_sku`)
    REFERENCES `app_db`.`books` (`sku`),
  CONSTRAINT `FK8ud3ggbyyjj1ra4ctrwkmbdjd`
    FOREIGN KEY (`book_export_id`)
    REFERENCES `app_db`.`book_exports` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `app_db`.`book_imports`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `app_db`.`book_imports` (
  `id` VARCHAR(20) NOT NULL,
  `created_at` DATETIME(6) NULL DEFAULT NULL,
  `created_by` VARCHAR(255) NULL DEFAULT NULL,
  `note` VARCHAR(200) NULL DEFAULT NULL,
  `reason` VARCHAR(200) NULL DEFAULT NULL,
  `status` BIT(1) NOT NULL,
  `total_cost` DOUBLE NOT NULL,
  `updated_at` DATETIME(6) NULL DEFAULT NULL,
  `updated_by` VARCHAR(255) NULL DEFAULT NULL,
  `supplier_id` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `FKb6okbvk9y33781b013yl3le2y` (`supplier_id` ASC) VISIBLE,
  CONSTRAINT `FKb6okbvk9y33781b013yl3le2y`
    FOREIGN KEY (`supplier_id`)
    REFERENCES `app_db`.`suppliers` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `app_db`.`book_import_items`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `app_db`.`book_import_items` (
  `id` VARCHAR(255) NOT NULL,
  `quantity` INT NOT NULL,
  `total_cost` DOUBLE NOT NULL,
  `unit_price` DOUBLE NOT NULL,
  `book_sku` VARCHAR(20) NOT NULL,
  `book_import_id` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `FK9w2tt2v38rig92urxmnvn1rm` (`book_sku` ASC) VISIBLE,
  INDEX `FKf7yae6fvvq60xqf821l4dyss` (`book_import_id` ASC) VISIBLE,
  CONSTRAINT `FK9w2tt2v38rig92urxmnvn1rm`
    FOREIGN KEY (`book_sku`)
    REFERENCES `app_db`.`books` (`sku`),
  CONSTRAINT `FKf7yae6fvvq60xqf821l4dyss`
    FOREIGN KEY (`book_import_id`)
    REFERENCES `app_db`.`book_imports` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `app_db`.`roles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `app_db`.`roles` (
  `id` VARCHAR(255) NOT NULL,
  `created_at` DATETIME(6) NULL DEFAULT NULL,
  `created_by` VARCHAR(255) NULL DEFAULT NULL,
  `description` VARCHAR(100) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `updated_at` DATETIME(6) NULL DEFAULT NULL,
  `updated_by` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `UKofx66keruapi6vyqpv6f2or37` (`name` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `app_db`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `app_db`.`users` (
  `id` VARCHAR(255) NOT NULL,
  `active` BIT(1) NOT NULL,
  `address` VARCHAR(100) NULL DEFAULT NULL,
  `created_at` DATETIME(6) NULL DEFAULT NULL,
  `created_by` VARCHAR(255) NULL DEFAULT NULL,
  `email` VARCHAR(100) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `otp` INT NULL DEFAULT NULL,
  `otp_validity` DATETIME(6) NULL DEFAULT NULL,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(10) NULL DEFAULT NULL,
  `refresh_token` VARCHAR(1000) NULL DEFAULT NULL,
  `updated_at` DATETIME(6) NULL DEFAULT NULL,
  `updated_by` VARCHAR(255) NULL DEFAULT NULL,
  `role_id` VARCHAR(255) NULL DEFAULT NULL,
  `cart_id` VARCHAR(255) NULL DEFAULT NULL,
  `google_id` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `UK6dotkott2kjsp8vw4d0m25fb7` (`email` ASC) VISIBLE,
  UNIQUE INDEX `UKpnp1baae4enifkkuq2cd01r9l` (`cart_id` ASC) VISIBLE,
  UNIQUE INDEX `phone_UNIQUE` (`phone` ASC) VISIBLE,
  INDEX `FKp56c1712k691lhsyewcssf40f` (`role_id` ASC) VISIBLE,
  CONSTRAINT `FKdv26y3bb4vdmsr89c9ppnx85w`
    FOREIGN KEY (`cart_id`)
    REFERENCES `app_db`.`carts` (`id`),
  CONSTRAINT `FKp56c1712k691lhsyewcssf40f`
    FOREIGN KEY (`role_id`)
    REFERENCES `app_db`.`roles` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `app_db`.`carts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `app_db`.`carts` (
  `id` VARCHAR(255) NOT NULL,
  `total_price` DOUBLE NOT NULL,
  `user_id` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `UK64t7ox312pqal3p7fg9o503c2` (`user_id` ASC) VISIBLE,
  CONSTRAINT `FKb5o626f86h46m4s7ms6ginnop`
    FOREIGN KEY (`user_id`)
    REFERENCES `app_db`.`users` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `app_db`.`cart_items`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `app_db`.`cart_items` (
  `id` VARCHAR(255) NOT NULL,
  `quantity` INT NOT NULL,
  `total_price` DOUBLE NOT NULL,
  `unit_price` DOUBLE NOT NULL,
  `book_sku` VARCHAR(20) NOT NULL,
  `cart_id` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `FK64q2pk9xv9gwye4qvuss4m8ve` (`book_sku` ASC) VISIBLE,
  INDEX `FKpcttvuq4mxppo8sxggjtn5i2c` (`cart_id` ASC) VISIBLE,
  CONSTRAINT `FK64q2pk9xv9gwye4qvuss4m8ve`
    FOREIGN KEY (`book_sku`)
    REFERENCES `app_db`.`books` (`sku`),
  CONSTRAINT `FKpcttvuq4mxppo8sxggjtn5i2c`
    FOREIGN KEY (`cart_id`)
    REFERENCES `app_db`.`carts` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `app_db`.`email_logs`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `app_db`.`email_logs` (
  `id` VARCHAR(255) NOT NULL,
  `created_at` DATETIME(6) NULL DEFAULT NULL,
  `recipient` VARCHAR(100) NOT NULL,
  `status` INT NOT NULL,
  `subject` VARCHAR(100) NOT NULL,
  `template` VARCHAR(100) NOT NULL,
  `updated_at` DATETIME(6) NULL DEFAULT NULL,
  `validity` DATETIME(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `app_db`.`invalidated_tokens`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `app_db`.`invalidated_tokens` (
  `id` VARCHAR(255) NOT NULL,
  `expired_at` DATETIME(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `app_db`.`logs`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `app_db`.`logs` (
  `id` VARCHAR(255) NOT NULL,
  `created_at` DATETIME(6) NULL DEFAULT NULL,
  `created_by` VARCHAR(255) NULL DEFAULT NULL,
  `description_key` VARCHAR(100) NOT NULL,
  `params` VARCHAR(100) NOT NULL,
  `action_key` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_createdAt_createdBy` (`created_at` ASC, `created_by` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `app_db`.`notifications`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `app_db`.`notifications` (
  `id` VARCHAR(255) NOT NULL,
  `content` VARCHAR(255) NOT NULL,
  `created_at` DATETIME(6) NOT NULL,
  `is_read` BIT(1) NOT NULL,
  `type` INT NOT NULL,
  `updated_at` DATETIME(6) NULL DEFAULT NULL,
  `user_id` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `app_db`.`orders`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `app_db`.`orders` (
  `id` VARCHAR(255) NOT NULL,
  `address` VARCHAR(100) NOT NULL,
  `created_at` DATETIME(6) NULL DEFAULT NULL,
  `created_by` VARCHAR(255) NULL DEFAULT NULL,
  `email` VARCHAR(100) NULL DEFAULT NULL,
  `method` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(10) NOT NULL,
  `reason` VARCHAR(500) NULL DEFAULT NULL,
  `status` INT NOT NULL,
  `total_price` DOUBLE NOT NULL,
  `updated_by` VARCHAR(255) NULL DEFAULT NULL,
  `invoice` INT NOT NULL,
  `note` VARCHAR(500) NULL DEFAULT NULL,
  `canceled_at` DATETIME(6) NULL DEFAULT NULL,
  `confirmed_at` DATETIME(6) NULL DEFAULT NULL,
  `delivered_at` DATETIME(6) NULL DEFAULT NULL,
  `rejected_at` DATETIME(6) NULL DEFAULT NULL,
  `is_payment` BIT(1) NULL DEFAULT NULL,
  `vnp_txn_ref` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `app_db`.`order_items`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `app_db`.`order_items` (
  `id` VARCHAR(255) NOT NULL,
  `quantity` INT NOT NULL,
  `total_price` DOUBLE NOT NULL,
  `unit_price` DOUBLE NOT NULL,
  `book_sku` VARCHAR(20) NOT NULL,
  `order_id` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `FK6k7day7dsrr5dpei99u0v7svd` (`book_sku` ASC) VISIBLE,
  INDEX `FKbioxgbv59vetrxe0ejfubep1w` (`order_id` ASC) VISIBLE,
  CONSTRAINT `FK6k7day7dsrr5dpei99u0v7svd`
    FOREIGN KEY (`book_sku`)
    REFERENCES `app_db`.`books` (`sku`),
  CONSTRAINT `FKbioxgbv59vetrxe0ejfubep1w`
    FOREIGN KEY (`order_id`)
    REFERENCES `app_db`.`orders` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `app_db`.`permissions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `app_db`.`permissions` (
  `id` VARCHAR(255) NOT NULL,
  `api_path` VARCHAR(100) NOT NULL,
  `created_at` DATETIME(6) NULL DEFAULT NULL,
  `created_by` VARCHAR(255) NULL DEFAULT NULL,
  `description` VARCHAR(100) NOT NULL,
  `method` VARCHAR(100) NOT NULL,
  `module` VARCHAR(100) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `updated_at` DATETIME(6) NULL DEFAULT NULL,
  `updated_by` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `UKpnvtwliis6p05pn6i3ndjrqt2` (`name` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `app_db`.`role_permissions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `app_db`.`role_permissions` (
  `role_id` VARCHAR(255) NOT NULL,
  `permission_id` VARCHAR(255) NOT NULL,
  INDEX `FKegdk29eiy7mdtefy5c7eirr6e` (`permission_id` ASC) VISIBLE,
  INDEX `FKn5fotdgk8d1xvo8nav9uv3muc` (`role_id` ASC) VISIBLE,
  CONSTRAINT `FKegdk29eiy7mdtefy5c7eirr6e`
    FOREIGN KEY (`permission_id`)
    REFERENCES `app_db`.`permissions` (`id`),
  CONSTRAINT `FKn5fotdgk8d1xvo8nav9uv3muc`
    FOREIGN KEY (`role_id`)
    REFERENCES `app_db`.`roles` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
