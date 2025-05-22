plugins {
    java
    id("org.springframework.boot") version "3.4.3"
    id("io.spring.dependency-management") version "1.1.7"
    id("com.diffplug.spotless") version "6.25.0"
    id("org.sonarqube") version "6.0.1.5171"
    id("org.springdoc.openapi-gradle-plugin") version "1.8.0"
}

group = "com.project"
version = "0.0.1-SNAPSHOT"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(17)
    }
}

configurations {
    compileOnly {
        extendsFrom(configurations.annotationProcessor.get())
    }
}

repositories {
    mavenCentral()
}

var mapstructSVersion = "1.6.3"
var springfilterVersion = "3.1.9"
var openAPIVersion = "2.8.5"

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-mail")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-oauth2-resource-server")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-thymeleaf")
    implementation("org.springframework.boot:spring-boot-starter-mail")
    implementation("org.springframework.boot:spring-boot-starter-websocket")
    implementation("org.thymeleaf.extras:thymeleaf-extras-springsecurity6")
    implementation("org.mapstruct:mapstruct:$mapstructSVersion")
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:$openAPIVersion")
    implementation("com.turkraft.springfilter:jpa:$springfilterVersion")
    compileOnly("org.projectlombok:lombok")
    developmentOnly("org.springframework.boot:spring-boot-devtools")
    runtimeOnly("com.mysql:mysql-connector-j")
    annotationProcessor("org.projectlombok:lombok")
    annotationProcessor("org.mapstruct:mapstruct-processor:$mapstructSVersion")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.withType<Test> {
    useJUnitPlatform()
}

spotless {
    java {
        target("src/**/*.java")
        googleJavaFormat()
        removeUnusedImports()
        trimTrailingWhitespace()
        endWithNewline()
    }
}

//sonarqube {
//    properties {
//        property("sonar.projectKey", "project.app-service")
//        property("sonar.projectName", "project.app-service")
//        property("sonar.organization", "my-org")
//        property("sonar.host.url", "http://localhost:9000")
//        property("sonar.login", "sqp_10af42cfee67003c4873c274046dddbdb291c0d6")
//    }
//}