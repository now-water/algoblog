---
title: '(1) EC2 서버 및 RDS 연동'
metaTitle: '만렙 개발자 키우기'
order: 1
tags: ['Backend']
date: '2021-07-04'
---

# EC2인스턴스 생성

AWS 에서 제공하는 프리티어를 사용하여 `t2.micro` 인스턴스를 사용하였다.

먼저 리전을 확인하고, `서울`로 변경해준다.

그리고 `EC2` 대시보드로 들어가 `인스턴스 시작`을 눌러서 AMI (Amazon Machine Image) 를 `Amazon linux 2` 로 선택한다.

`아마존 리눅스 2`는 Centos7 버전의 자료들을 그대로 사용할 수 있고, RedHat 베이스를 갖는다. 그리고 Amazon 의 독자적인 개발 리포지토리를 사용해서 yum이 매우 빠르다는 장점이 있다.

그리고 아마존이 개발하고 있어서 AWS의 다른 서비스와 상성이 좋다

> 다른 이미지를 사용해도 되지만, 이번 정리에서는 해당 이미지를 사용하기로 결정하였다.
>
> 참고한 자료에서는 우분투를 사용해서 CI/CD 구축을 진행하면서 참고한 내용과 많이 달랐다. 이때까지만 해도 앞으로 수많은 시행착오를 겪을 것이라고 상상하지 못했다..


`t2.micro` 를 선택한 후, `다음:인스턴스 세부 정보 구성` 버튼을 눌러준다.

`단계 3: 인스턴스 세부 정보 구성` 은 뛰어넘고, `단계 4: 스토리지 구성` 에서 **기본 스토리지 8GB 에서 프리티어의 최대치인 30GB로 반드시 변경해준다.**
그리고 `단계 5: 태그`는 인스턴스를 구분하기 위한 값을 임의로 설정해준다.

`보안 그룹` 에서 다음과 같이 열어준다.

![image](https://user-images.githubusercontent.com/51476083/124384841-16660f00-dd0e-11eb-8388-730d17bcac9a.png)

이후 `TCP 8080 포트` 로 젠킨스를 연동하고, `스프링부트 Jar1` 을 8089, `스프링부트 Jar2` 를 8090 포트로 열어준다 .

그리고 기본 HTTP 80 포트와, SSH 22 포트를 열어둔다.

> SSH 전체 오픈의 경우, `pem 키`가 파일 공유 디렉토리나 깃허브 등에 실수로 노출되면 바로 서버에서 가상화폐가 채굴되는 현상을 목격할 수도 있다..
>
> 따라서 **지정된 IP에서만 ssh 접속이 가능하도록 보안을 높게 설정해두는 것이 권장**되는 방법이다. 그리고 다른 장소에서 접속할 때마다 해당 장소의 IP를 다시 SSH 인바운드 규칙에 추가하는 것이 안전하다.
>
> 이번 실습에서는 pem 키를 공유하지 않는 것에 유의해서 전체 개방 후 진행하도록 한다.

이후 새 키 페어를 생성해서 다운받으면 인스턴스 생성이 완료된다.

**인스턴스를 중지하고 다시 시작할 때마다 새로운 IP가 할당된다.** 할당된 탄력적 IP 주소를 생성한 EC2 주소와 연결해준다.

=> 기본적으로 맞춰진 옵션대로 그냥 진행하고 할당해주면 된다. (작업-주소 연결)

> 탄력적 IP를 생성하고 EC2 서버에 연결하지 않으면 비용 발생 ! 반드시 EC2에 바로 연결해줘야 한다.
>
> 더는 사용할 인스턴스가 없다면 탄력적 IP를 삭제해줘야 비용이 발생하지 않는다.

<br/>

## SSH 접속

내가 주로 사용하는 Linux 기준으로 설명하겠다.

기존에 외부 서버로 SSH 접속을 하려면 다음의 명령어를 입력해야 했다.

`ssh -i pem키_위치 EC2_IP_주소`

입력하기 꽤 귀찮은 커맨드이므로, 쉽게 ssh 접속을 할 수 있도록 설정한다.

**1. 키페어 pem 파일을 `~/.ssh/` 로 복사한다.**

- `~/.ssh/` 디렉토리로 pem 파일을 옮겨 놓으면 ssh 실행 시 pem 키 파일을 자동으로 읽어 접속을 진행한다.

- 이후 별도 pem키의 위치를 명령어로 지정할 필요가 없다.

- > **커맨드** : `cp pem 키를 내려받은 위치 ~/.ssh/`


**2. 복사된 pem 키의 권한을 변경해준다.**

> **커맨드**
> 1. `cd ~/.ssh/` : 해당 디렉토리로 이동
>
> 2. `chmod 600 ~/.ssh/pem키 이름` : 파일 권한 변경
>
> 3. `ll` : 파일 권환 확인

![image](https://user-images.githubusercontent.com/51476083/124385153-90e35e80-dd0f-11eb-9f3a-aa2e36a291bc.png)

**3. config 파일 생성**

- pem 키가 있는 `~./.ssh` 디렉토리 안에 `config` 파일을 생성한다.

- 그리고 다음과 같이 파일을 수정해준다.

   ![image](https://user-images.githubusercontent.com/51476083/124385551-23d0c880-dd11-11eb-8b8d-ee51e9c6899c.png)

- 이후 `chmod 700 ~/.ssh/config` 를 실행해 config 파일의 실행 권한을 설정해준다.

- `ssh config에 등록한 서비스 명` 명령어로 서버에 접속한다.


![image](https://user-images.githubusercontent.com/51476083/124385683-c8eba100-dd11-11eb-8332-3757342c0db1.png)

접속 완료 !

## 서버 환경 설정

### Java 설치

- **Java 8 설치**

  sudo yum install y java-1.8.0-openjdk-devel.x86_64


- **인스턴스의 Java 버전을 8로 변경**

  `sudo /usr/sbin/alternatives --config java`


- **자바 버전 변경 후 사용하지 않는 Java7 삭제**

  `sudo yum remove java-1.7.0-openjdk`


- **자바 버전 확인**

  `java -version`

### 타임존 변경

EC2 서버의 기존 타임존은 UTC이다. 이는 세계 표준 시간으로 한국 시간과 9시간 차이가 난다.

따라서 서버의 타임존을 한국 시간(KST)로 변경해준다.

```text
sudo rm /etc/localtime
sudo ln -s /usr/share/zoneinfo/Asia/Seoul /etc/localtime
```

이후 `date` 커맨드로 타임존이 KST로 변경되었는지 확인

![image](https://user-images.githubusercontent.com/51476083/124385905-c5a4e500-dd12-11eb-9a8f-8ef966c89183.png)

### Hostname 변경

**여러 서버 관리할 때 IP만으로 어떤 서비스의 서버인지 확인하기 어렵다**

따라서 각 서버가 어느 서비스인지 표현하기 위해 `HOSTNAME` 을 변경한다

1. `sudo hostnamectl set-hostname 변경할 호스트 이름` 커맨드 실행


2. `sudo vim /etc/hosts` 실행해서 아래 항목 추가

    `127.0.0.1 변경할 호스트 이름`

    ![image](https://user-images.githubusercontent.com/51476083/124386375-10bff780-dd15-11eb-95d2-77a513fcce1e.png)

3. `sudo reboot` 커맨드로 서버 재부팅

![image](https://user-images.githubusercontent.com/51476083/124386317-ce96b600-dd14-11eb-8a17-840875ecb185.png)

변경 완료 !

---

# EC2 인스턴스 SWAP 메모리 설정

프리티어의 경우 메모리가 1GB 밖에 안되는 인스턴스를 사용한다.

스프링 부트 jar 파일을 2개 구동 시 메모리가 부족할 수도 있다. 따라서 디스크를 떼어내서 스왑 메모리로 사용함으로써 조금 더 안정성을 보완할 수 있다. (실제로 서버가 몇 번 다운되었음...)


```java
// 1. 아래 명령어로 디스크 2GB를 스왑 파일에 할당해준다.
sudo dd if=/dev/zero of=/swapfile bs=128M count=16

// 2. 스왑 파일의 읽기, 쓰기 권한을 바꾼다.
sudo chmod 600 /swapfile

// 3. 스왑 영역을 설정한다.
sudo sudo mkswap /swapfile

// 4. 스왑 공간에 스왑 파일을 추가하여 스왑 파일을 사용할 수 있도록 한다.
sudo swapon /swapfile

// 5. 스왑 공간이 설정되었는지 확인한다.
sudo swapon -s

// 6. 우분투가 재시동될 때 자동으로 스왑메모리를 설정한다.
// 다음과 같이 해당 파일을 열고,
vim /etc/fstab
// 맨 마지막 줄에 다음의 내용을 추가해준다.
/swapfile swap swap defaults 0 0

// 7. 메모리 확인 명령어로 확인한다.
free -m
```

---

# 스프링 프로필 세팅

> 무중단 배포 시, Nginx 가 두 개의 스프링 jar를 구분할 수 있도록 하기 위해 프로필을 세팅한다.

`WebRestController` 클래스를 생성하고, **현재 적용 중인 프로필을 반환**하는 API 메소드를 다음과 같이 작성하고 깃허브에 푸쉬한다.

```java
@RestController
@RequiredArgsConstructor
public class WebRestController {

  private final Environment env;

  @GetMapping("/profile")
  public String getProfile() {
    return Arrays.stream(env.getActiveProfiles()).findFirst().orElse("");
  }
}
```

그리고 `git clone 프로젝트_url` 을 통해서 EC2 에 프로젝트를 받아온다.

EC2 내부에 다음과 같이 `prod-application.yaml` 파일을 생성하여 설정해준다.

- `sudo mkdir ~/app`

- `sudo mkdir ~/app/config`

- `sudo vim ~/app/config/prod-application.yaml`

![image](https://user-images.githubusercontent.com/51476083/124388665-ce9bb380-dd1e-11eb-927c-5d8004af322b.png)

> AWS RDS 연동은 아래에서 수행한다.
>
> 여기서 설명하고자 하는 내용은 **스프링 프로필을 포트 번호와 프로필 명으로 나눠서 관리**할 수 있다는 것이다.

이후 받아온 프로젝트 디렉토리에 들어가서 `./gradlew build` 를 해서 빌드를 수행한다.

> 나의 경우, gradle이 설치되어 있지 않아 `gradlew` 을 이용하였다.
>
> 그리고 build에 계속 실패해서 `./gradlew --exclude-task test` 를 실행하여 테스트 없이 빌드를 수행하였다

빌드까지 무사히 완료되었으면, `./build/libs` 디렉토리 내부에 `jar` 파일이 생성되어 있을 것이다.

이 jar 파일을 실행해서 서버를 구동시킬 수 있다.

- `java -jar cse-0.0.1-SNAPSHOT.jar --spring.config.location=file:config/prod-application.yaml --spring.profiles.active=구동할 프로필 명`


- **스프링 부트는 톰캣을 내장하고 있어서 쉽게 배포 가능한 jar 파일을 이용할 수 있다.**

<br/>
다음과 같이 `prod1` 프로필로 실행됨을 확인할 수 있다.

![image](https://user-images.githubusercontent.com/51476083/124389170-f1c76280-dd20-11eb-8aa3-81825db66939.png)

> 이때, 그냥 `java -jar 명령어`를 사용하면 사용자가 터미널 접속 종료 시 애플리케이션도 함께 종료된다.
>
> 하지만 `nohup java -jar 명령어` 를 사용하면, 애플리케이션 실행자가 터미널을 종료해도 애플리케이션은 계속 구동한다.



---

# AWS RDS 연동

사실 CI/CD 구축과는 관련이 없지만, 이후 EC2 서버를 사용할 상황이 온다면, `AWS RDS` 도 함께 사용할 일이 많을 것 같아 같이 정리해두려고 한다.

게다가 이번 프로젝트에서도 RDS를 사용할 예정이어서, 환경 구축할 때 같이 하려고 한다.

만약 CI/CD 구축이 목적이라면 해당 부분은 넘어가도 된다.

## RDS 인스턴스 생성

Amazon RDS 서비스에 가서 `데이터베이스 생성` 을 누른다.

`MySQL`을 가장 많이 다뤄봤으므로 나는 `MySQL` 을 선택하였다. (실제로 국내외의 오픈소스 데이터베이스 중 가장 인기가 많기도 하다.)

엔진 옵션을 `MySQL` 로 선택하고, 프리티어로 생성한다.

`할당된 스토리지`는 20 GB 를 그대로 사용하며, 상세 설정에서 `식별자 이름`과 `마스터 사용자 이름`, `마스터 암호`를 설정해준다.

이후에도 해당 정보로 데이터베이스에 접근하므로, 반드시 기억하거나 메모해둔다.

그리고 **`퍼블릭 엑세스 기능`을 예 로 선택해준다.** 그 외의 설정은 기본값으로 그대로 사용하고 DB 인스턴스 생성

## 파라미터 그룹

`파라미터 그룹`을 생성해서 RDS 설정을 맞춰준다.

**1. `파라미터 그룹 패밀리` 는 방금 생성한 데이터베이스와 같은 버전으로 맞춰준다.**

- 그룹 이름과 설명은 원하는 대로 설정해준다.


**2. 생성된 파라미터 그룹을 클릭해 다음 항목들을 편집한다.**

| 항목 이름 | 설정값 |
| :---: | :---: |
| time_zone | Asia/Seoul |
| character_set_client | utf8mb4 |
| character_set_connection | utf8mb4 |
| character_set_database | utf8mb4 |
| character_set_filesystem | utf8mb4 |
| character_set_results | utf8mb4 |
| character_set_server | utf8mb4 |
| collation_connection | utf8mb4_general_ci |
| collation_server | utf8mb4_general_ci |
| max_connections | 150 |

> utf8과 다른 점으로 utf8mb4 는 이모지를 저장할 수 있다.


**3. 생성한 데이터베이스의 수정한다. **

- 방금 생성한 DB 파라미터 그룹을 지정해준다.


- 수정 사항은 `즉시 적용`을 적용한다.


**4. RDS 보안 그룹 인바운드를 수정한다.**

- EC2 에 사용된 보안 그룹의 `그룹 ID` 를 복사한다.


- RDS 보안 그룹의 인바운드에, `복사된 보안 그룹 ID` 와 `본인 IP`를 추가한다.

  - MYSQL/Aurora , TCP, 3306, 사용자 지정-`복사된 보안 그룹 ID`

  - MYSQL/Aurora , TCP, 3306, 내 IP


**5. 생성된 데이터베이스의 엔드포인트로 접속해본다.**

- `Endpoint 주소`와 `포트 번호`, `마스터 이름`, `마스터 비밀번호`를 사용해서 DB 툴을 이용해 접속한다.


- 나는 IntelliJ 의 플러그인 `Database Navigator` 를 이용해서 다음과 같이 접속 및 테스트하였다.

  ![image](https://user-images.githubusercontent.com/51476083/124387106-34d10800-dd18-11eb-822d-667740c80316.png)

  `Test Connection` 버튼을 눌러 연결 테스트 후 저장한다.


- 다음과 같이 스키마를 생성하고 선택한다.

  ![image](https://user-images.githubusercontent.com/51476083/124387219-a27d3400-dd18-11eb-9018-cdd37f990b93.png)

  ![image](https://user-images.githubusercontent.com/51476083/124387268-ce001e80-dd18-11eb-8552-a89a42d7c92a.png)


- ```sql select @@time_zone, now()` ``` 을 수행해서 선택된 데이터베이스의 RDS 파라미터 그룹이 잘 적용되었는지 확인


**6. EC2 에서 RDS 접근을 확인한다.**

- `sudo yum install mysql`


- `mysql -u 계정 -p -h Host 주소`

  - 나의 경우 `mysql -u root -p -h knu-cse-app.c1uia78sjzh5.ap-northeast-2.rds.amazonaws.com`


- 이후 비밀번호를 입력하면 RDS 접속 완료!
