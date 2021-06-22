---
title: 'making Multi module'
order: 1
---

## 초기 멀티 모듈 구조 설계

회원, 게시판, 댓글 기능을 제공하는 커뮤니티 사이트를 구축하려고 한다.

### 프로젝트 구조

- Root Project : `gallery`

* Sub project(module) : `batch`, `admin` `core` `pc-web`

![image](https://user-images.githubusercontent.com/51476083/106502460-bc1b1500-6507-11eb-983f-ee1920e1691f.png)

📌 **`core` 가 다른 프로젝트에서 사용할 수 있는 중요한 클래스 및 공통 클래스를 모아놓은 프로젝트다.**

1. 루트 프로젝트의 src 디렉터리 내용을 모두 `batch` 모듈 하위로 옮기고 `gallery`의 src는 삭제한다.

2) `gallery`의 `build` 디렉터리는 필요없으므로 삭제한다.

3. `settings.gradle` 에 신규로 생성한 모듈의 내용을 추가한다.

   > settings.gradle 는 다음과 같이 자동으로 세팅이 되어 있다.

   ![image](https://user-images.githubusercontent.com/51476083/106376940-c42a6600-63dc-11eb-8f3d-18d6c5dbf203.png)

4) `build.gradle`에 모듈별로 설정을 추가한다.

   > 루트 프로젝트의 `build.gradle`에 모든 모듈의 라이브러리 설정 내용을 작성해도 되고, 각각의 모듈별 `build.gradle`에 관련 내용을 작성해도 된다. <br/>
   > 여기선 루트 프로젝트에서 내용을 작성하겠다.

   ```java
   buildscript {
       ext {
           springBootVersion = '2.4.2'
       }
       repositories {
           mavenCentral()
       }
       dependencies {
           classpath("org.springframework.boot:spring-boot-gradle-plugin:${springBootVersion}")
       }
   }

   allprojects {
       repositories {
           mavenCentral()
       }
   }

   subprojects {
       apply plugin: 'java'
       apply plugin: 'org.springframework.boot'
       apply plugin: 'io.spring.dependency-management'

       group = 'com.gongsung.gallery'
       version = '0.0.1-SNAPSHOT'
       sourceCompatibility = '11'

       dependencies {
           implementation 'org.springframework.boot:spring-boot-starter-web'
           implementation 'org.springframework.boot:spring-boot-starter-aop'
           implementation 'org.springframework.boot:spring-boot-starter'

           // use lombok
           compileOnly 'org.projectlombok:lombok'
           annotationProcessor 'org.projectlombok:lombok'

           // commons-io
           implementation group: 'commons-io', name: 'commons-io', version: '2.6'

           // jackson-annotations
           implementation 'com.fasterxml.jackson.core:jackson-annotations'

           // test
           testCompile group: 'junit', name: 'junit', version: '4.12'
           testImplementation 'org.springframework.boot:spring-boot-starter-test'
       }

       test {
           useJUnitPlatform()
           useJUnit()
       }
   }

   def executableProjects = [project(':admin'), project(':batch'), project(':pc-web')]
   def jarProjects = [project(':core')]

   configure(executableProjects) {
       dependencies {
           // executable projects에서 필요한 것들
       }
   }

   configure(jarProjects) {
       dependencies {
           // jar projects에서 필요한 것들
       }
   }

   project(':pc-web') {
       dependencies {
           compile project(':core')
       }
   }

   project(':admin') {
       dependencies {
           compile project(':core')
       }
   }

   project(':batch') {
       dependencies {
           compile project(':core')
       }
   }
   ```

5) `batch`, `admin`, `pc-web`, 수정

- 모듈 별로 구동하기 위해 `module/src/java/` 에 `SpringBoot Application`을 작성해준다.

  ```java
  @SpringBootApplication
  public class batch {
      public static void main(String[] args) {
          SpringApplication.run(batch.class, args);
      }
  }
  ```

  ```java
  @SpringBootApplication
  public class admin {
      public static void main(String[] args) {
          SpringApplication.run(admin.class, args);
      }
  }
  ```

  ```java
  @SpringBootApplication
  public class pc-web {
      public static void main(String[] args) {
          SpringApplication.run(pc-web.class, args);
      }
  }
  ```

6. 멀티 모듈 작동 확인

- [`gradle bootRun` 으로 실행할 경우](https://docs.spring.io/spring-boot/docs/current/gradle-plugin/reference/htmlsingle/#running-your-application-passing-arguments) <br/>

  디폴트로 실행할 `MainClass` 를 찾는데, 작업의 classpath 에서 디렉토리에 있는 메서드들 중 `public static void main(String [] args)` 메서드를 가진 클래스를 자동으로 탐색해서 찾는다.

* `gradlew :batch:bootRun`, `gradlew :pc-web:bootRun`, `gradlew :admin:bootRun`
  <br/>

  ![image](https://user-images.githubusercontent.com/51476083/106502228-72cac580-6507-11eb-8249-508a67cb80d6.png)

![image](https://user-images.githubusercontent.com/51476083/106377738-93e5c600-63e2-11eb-87a6-ace47b970024.png)

![image](https://user-images.githubusercontent.com/51476083/106377727-7f093280-63e2-11eb-93f1-01ebbb83b7d1.png)

## 성공적으로 동작한다.
