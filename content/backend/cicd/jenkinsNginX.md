---
title: '(2) Jenkins 및 Nginx 설치'
metaTitle: '만렙 개발자 키우기'
order: 2
tags: ['Backend']
date: '2021-07-04'
---

# Nginx 설치 및 실행

> `ubuntu` 에서는 Nginx 를 다음과 같이 설치할 수 있다. <br/>
> `sudo apt-get install nginx`

| 목적 | 명령어 |
| :---: | :---: |
| 설치 | `sudo amazon-linux-extras install -y nginx1` |
| 버전 확인 | `nginx -v` |
| 실행 | `sudo service nginx start` |
| 중지 | `sudo service nginx stop` |
| 상태 확인 | `sudo service nginx status` |
| 중지 했다가 시작 | `sudo service nginx restart` |
| 정상적으로 다시 시작 | `sudo service nginx reload` |

nginx 는 Port 80 으로 구동하기 때문에 nginx 를 구동하는 EC2 의 인바운드 규칙을 편집해준다. -> `80번 포트 개방`

> nginx 에 에러가 발생했다면, `/var/log/nginx/error.log` 파일을 통해 확인할 수 있다.
>
> - 이때, 관리자 계정으로만 확인이 가능하다. 따라서 관리자 계정으로 전환해줘야 한다.
>   => `sudo -u root -i`
>
>
> - `error.log` 의 마지막 10 줄만 확인 => `tail -f /var/log/nginx/error.log`

nginx 가 정상적으로 실행되면 다음과 같은 기분 좋은 `Welcome` 페이지가 뜬다!

![image](https://user-images.githubusercontent.com/51476083/124389598-e1b08280-dd22-11eb-9a3e-f1600d0cd41a.png)


## Nginx 설정

EC2 의 EIP에 Port 80 으로 접속할 경우 위와 같은 기본 페이지가 열린다.

이러한 사용자의 요청을 스프링으로 전달하기 위해 Nginx 설정을 해준다.

아래 명령어로 설정 파일을 열어준다.

> sudo vim /etc/nginx/nginx.conf

> 현재 Amazon linux2 에서는 `nginx1` 을 사용하고, ubuntu 에서는 `nginx` 를 사용한다.
>
> 따라서 `nginx.conf` 파일의 위치가 다를 수 있다.
>
> ubuntu 에서는 `/etc/nginx/sites-enabled/default` 를 통해 수정해 줄 수 있다.

<br/>
그리고 다음의 명령어들을 아래 사진처럼 추가해준다.

> 1. `client_max_body_size 100M;` 
> 2. `include conf.d/service-url.inc;` <br/>
> 3. `proxy_pass $service_url;`
> 4. `resolver 127.0.0.1;`

![image](https://user-images.githubusercontent.com/51476083/129363316-9eda8660-b74f-48bc-9604-1117c9bc3493.png)

모든 설정 이후 Nginx를 재시작 해준다.

- `service nginx restart`

> **client_max_body_size 100M** 를 해줘야 클라이언트 측에서 큰 용량을 업로드할 수 있다.
> 
> 클라이언트 개발 팀원으로부터 사진 업로드가 안된다는 피드백을 받아서 확인해보니, Nginx 의 파일 업로드 디폴트가 1MB 라고 한다.. 

그리고 `/etc/nginx/conf.d/` 디렉터리 안에 `service-url.inc` 파일을 생성하고 다음의 내용을 추가해준다.

`set $service_url http://127.0.0.1:8089;`

- `127.0.0.1` : 현재 EC2 인스턴스의 EIP


- `8089 포트` : 8089 포트를 사용하는 스프링 프로필

그러면 **nginx는 사용자의 80 포트로의 요청을 8089 포트를 사용하는 스프링으로 전달해준다.**

이때, resolver 를 등록해주지 않으면 `resolve 관련 에러`가 발생한다. (해결법을 찾느라 한참 삽질을 했다..)

성공적으로 설정이 완료되면 다음과 같이 nginx 로 요청을 보냈을 때 스프링 컨트롤러로 요청이 전달되는 것을 확인할 수 있다.

![image](https://user-images.githubusercontent.com/51476083/124390267-b0858180-dd25-11eb-90a4-d172b925632a.png)

다음과 같이 확인할 수도 있다.

![image](https://user-images.githubusercontent.com/51476083/124390310-ea568800-dd25-11eb-80a8-8990987c7394.png)

---

# 재시동 및 전환 쉘 스크립트 작성

> Nginx 설정 및 실행을 통해 nginx로 들어온 요청이 스프링 서버로 전달되는 것을 확인할 수 있었다.
>
> 이번엔 쉘 스크립트를 사용해서 스프링 서버를 재시동하고 nginx가 해당 스프링 서버를 가리킬 수 있도록 한다.
>
> 이때 필요한 쉘 스크립트는 총 2가지이다.

## 재시동 쉘 스크립트

재시동 스크립트는 Nginx 가 idle 상태의 서버를 재시동하는 스크립트이다.

`~/app/` 디렉터리에 `deploy.sh` 파일을 만들고 다음의 스크립트를 작성해준다.

### deploy.sh
```shell
#!/bin/bash
echo "> 현재 구동중인 profile 확인"
CURRENT_PROFILE=$(curl -s http://localhost/profile)
echo "> $CURRENT_PROFILE"

if [ $CURRENT_PROFILE == prod1 ]
then
  IDLE_PROFILE=prod2
  IDLE_PORT=8090
elif [ $CURRENT_PROFILE == prod2 ]
then
  IDLE_PROFILE=prod1
  IDLE_PORT=8089
else
  echo "> 일치하는 Profile이 없습니다. Profile: $CURRENT_PROFILE"
  echo "> prod1을 할당합니다. IDLE_PROFILE: prod1"
  IDLE_PROFILE=prod1
  IDLE_PORT=8089
fi

echo "> $IDLE_PROFILE 배포"
sudo fuser -k -n tcp $IDLE_PORT
sudo nohup java -jar /home/ec2-user/app/cse-0.0.1-SNAPSHOT.jar --spring.config.location=file:/home/ec2-user/app/config/prod-application.yaml --spring.profiles.active=$IDLE_PROFILE &

echo "> $IDLE_PROFILE 10초 후 Health check 시작"
echo "> curl -s http://localhost:$IDLE_PORT/actuator/health "
sleep 10

for retry_count in {1..10}
do
  response=$(curl -s http://localhost:$IDLE_PORT/actuator/health)
  up_count=$(echo $response | grep 'UP' | wc -l)

  if [ $up_count -ge 1 ]
  then
    echo "> Health check 성공"
    break
  else
    echo "> Health check의 응답을 알 수 없거나 혹은 status가 UP이 아닙니다."
    echo "> Health check: ${response}"
  fi

  if [ $retry_count -eq 10 ]
  then
    echo "> Health check 실패. "
    echo "> Nginx에 연결하지 않고 배포를 종료합니다."
    exit 1
  fi

  echo "> Health check 연결 실패. 재시도..."
  sleep 10
done

echo "> 스위칭을 시도합니다..."
sleep 10

/home/ec2-user/app/switch.sh
```

위 스크립트의 내용을 하나하나 분석해보자.

- **3번 라인** : 현재 nginx 가 가리키는 스프링의 profile을 확인한다.


- **6~19번 라인** : nginx가 가리키고 있는 `CURRENT_PROFILE` 과 그렇지 않은 `IDLE_PROFILE` 을 구분한다.


- **21~23번 라인**

  - `sudo fuser -k -n tcp $IDLE_PORT` : IDLE_PORT로 구동 중인 스프링 서버가 있으면 중단

  - `sudo nohup java -jar /home/ec2-user/app/cse-0.0.1-SNAPSHOT.jar --spring.config.location=file:/home/ec2-user/app/config/prod-application.yaml --spring.profiles.active=$IDLE_PROFILE &` : 스프링 로그는 `nohup.out` 에 기록하며 백그라운드로 `IDLE_PROFILE`의 스프링 서버 가동


- **25~ 라인**

  - 일정 시간 후 10번 동안 서버 `health check` - *Actuator 라이브러리 사용*

  -  실패하면 `code 1` 로 스크립트 종료.

  - 성공하면 반복문을 빠져나가고 전환 스크립트 실행

<br/>

> **`build.gradle` 에 spring actuator 라이브러리 추가**
>
> implementation 'org.springframework.boot:spring-boot-starter-actuator
>
> 이후 `/actutor/health` 로 get 요청을 보내서 서버의 상태를 확인할 수 있다.
>
> {"status":"up"} 일 경우 정상상


## 전환 쉘 스크립트

전환 스크립트는 nginx가 가리키는 스프링 서버를 바꾸는 스크립트다.

`~/app` 디렉터리 안에 `switch.sh` 파일을 생성하고 다음과 같이 스크립트를 작성한다.

### switch.sh

```shell
#!/bin/bash
echo "> 현재 구동중인 Port 확인"
CURRENT_PROFILE=$(curl -s http://localhost/profile)

if [ $CURRENT_PROFILE == prod1 ]
then
  IDLE_PORT=8090
elif [ $CURRENT_PROFILE == prod2 ]
then
  IDLE_PORT=8089
else
  echo "> 일치하는 Profile이 없습니다. Profile:$CURRENT_PROFILE"
  echo "> 8089를 할당합니다."
  IDLE_PORT=8089
fi

PROXY_PORT=$(curl -s http://localhost/profile)
echo "> 현재 구동중인 Port: $PROXY_PORT"

echo "> 전환할 Port : $IDLE_PORT"
echo "> Port 전환"
echo "set \$service_url http://127.0.0.1:${IDLE_PORT};" | sudo tee /etc/nginx/conf.d/service-url.inc

echo "> Nginx Reload"
sudo service nginx reload
```

마찬가지로 전환 스크립트도 내용을 하나하나 분석해보자.

- 3~15번 라인 : 현재 구동 중인 스프링 프로필을 확인 하여 새롭게 가리킬 프로필 셋을 지정한다.


- 22번 라인 : `/etc/nginx/conf.d/service-url.inc` 파일에 포트 부분을 `IDLE_PORT`로 바꿔준다.


- 25번 라인 : nginx가 새로 업데이트된 `service-url.inc` 파일의 내용을 리로드하여 재시작한다.

## 쉘 스크립트 실행

2개의 쉘 스크립트에 실행 권한을 다음과 같이 설정해준다.

```shell
chmod +x ~/app/deploy.sh
chmod +x ~/app/switch.sh
```

그리고 `sh deploy.sh` 명령어로 스크립트를 실행한다.

![image](https://user-images.githubusercontent.com/51476083/124391033-87ff8680-dd29-11eb-8463-8799193ca5a2.png)

위와 같이 정상적으로 재시동/전환 스크립트가 실행되는 것을 확인할 수 있다.

> **요약**
>
> 2대의 스프링 서버 중 nginx가 가리키지 않는 서버를 재시동하고 nginx가 해당 서버를 가리키도록 동작한다.

---

# Jenkins

## 설치

**1. 자바가 깔려있지 않다면**

- `sudo amazon-linux-extras install java-openjdk11`


**2. Amazon Linux2 server에 Jenkins repository 추가**

- `sudo tee /etc/yum.repos.d/jenkins.repo<<EOF` 실행


- 파일 내부에 다음과 같이 작성

  ```shell
  [jenkins]
  name=Jenkins
  baseurl=http://pkg.jenkins.io/redhat
  gpgcheck=0
  EOF
  ```


**3. GPG repository key 를 import 한다**

  `sudo rpm --import https://jenkins-ci.org/redhat/jenkins-ci.org.key`


**4. 작동 중인 사항을 확인하기 위해 repository 리스트 업데이트**


  `sudo yum repolist`


**5. Amazon Linux2 server에 Jenkins 설치**

  `sudo yum install jenkins`


**6. OS 부팅 시 자동으로 jenkins service를 실행하도록 한다.**

- 젠킨스 시작 : `sudo systemctl start jenkins`


- 부팅 시 자동 시작 : `sudo systemctl enable jenkins`


- 젠킨스 상태 확인 : `systemctl status jenkins`


**7. 젠킨스 서비스가 제대로 바인드 되었는지 확인**

  `sudo ss -tunelp | grep 8080`


## 실행 및 설정

`sudo systemctl start jenkins` 로 실행

젠킨스는 디폴트로 8080 포트를 사용한다. 따라서 EC2 보안 그룹 인바운드 규칙에서 8080 포트를 개방해야 한다.

이후 `http://EC2 서버 IP:8080` 으로 접속하면 젠킨스 로그인 페이지가 켜진다.

![image](https://user-images.githubusercontent.com/51476083/124391800-3658fb00-dd2d-11eb-8d7e-7c2befcd5f7a.png)

`cat /var/lib/jenkins/secrets/initialAdminPassword` 명령어를 실행하면 `초기 비밀번호`가 출력된다. 이를 사용해서 `Continue` 버튼을 눌러준다.

<br/>

![image](https://user-images.githubusercontent.com/51476083/124391839-5ee0f500-dd2d-11eb-856f-8be14d2aa159.png)

위의 화면에서 `Install suggested plugins` 를 선택하면 자동으로 설치가 시작된다.

![image](https://user-images.githubusercontent.com/51476083/124391855-78823c80-dd2d-11eb-8df1-987bed4cf2fb.png)

<br/>

설치가 완료되면 `Admin user` 를 설정하는 화면이 나온다. 사용할 계정과 암호를 설정해주면 된다.

![image](https://user-images.githubusercontent.com/51476083/124391882-ae272580-dd2d-11eb-83c1-d7265b2cf996.png)


젠킨스가 디폴트로 구동하는 url 을 설정하는 화면이 뜨는데, EC2 의 EIP가 기본적으로 세팅되어 있다. 별도의 수정없이 다음 단계로 넘어간다.

![image](https://user-images.githubusercontent.com/51476083/124391924-ea5a8600-dd2d-11eb-8750-ec16ab9749d8.png)


그럼 설정을 끝마친 젠킨스의 첫 화면이 나타나고 설치가 끝난다.

![image](https://user-images.githubusercontent.com/51476083/124391969-28f04080-dd2e-11eb-84a1-f76aa5b4b58b.png)


