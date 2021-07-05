---
title: '(3) CI/CD 무중단 배포'
metaTitle: '만렙 개발자 키우기'
order: 3
tags: ['Backend']
date: '2021-07-04'
---

# Jenkins 를 활용한 CI 구축

**CI (Continuous Integration)**

github 에서 지정한 브랜치에 변화가 생기면 자동으로 pull 하는 CI를 구축한다.

## 깃허브 서버와 연동

다음 사진에 보이는 것처럼 `프로필 - Setting - Developer settings` 메뉴로 들어온다.

![image](https://user-images.githubusercontent.com/51476083/124392161-1f1b0d00-dd2f-11eb-92fd-16f56c6d49a6.png)

좌측 네비게이션에서 `Personal access tokens` 로 들어가서 새로운 토큰을 생성한다.

그리고 다음과 같이 체크를 해준 뒤 토큰을 생성한다.

![image](https://user-images.githubusercontent.com/51476083/124392234-60abb800-dd2f-11eb-8316-8b055d0bd994.png)

그러면 토큰이 생성되는데, 해당 토큰을 복사해둔다.

이후 젠킨스로 접속하여 `Jenkins 관리 - 시스템 설정` 으로 들어간다.

![image](https://user-images.githubusercontent.com/51476083/124392379-2393f580-dd30-11eb-9aaa-732a04557ad8.png)

Github 세션에서 `Add github Server - Github Server` 를 클릭하고, `Credentials` 부분의 `Add - Jenkins` 를 클릭한다.

![image](https://user-images.githubusercontent.com/51476083/124393619-3e696880-dd36-11eb-8421-f205864f5b75.png)

`Kind` 를 Secret text 로 설정하고, `Secret` 에 위에서 복사한 `Personal access token`을 입력한다. 그리고 ID에 자신의 github ID를 입력한 후 `Add` 버튼을 눌러서 완성한다.

![image](https://user-images.githubusercontent.com/51476083/124393713-bf286480-dd36-11eb-97ef-c5a00353160f.png)

방금 만든 `Credentials`로 설정한 후 `Test connection`을 클릭해 제대로 동작되는지 확인한다.

![image](https://user-images.githubusercontent.com/51476083/124393744-db2c0600-dd36-11eb-87f1-0f6f5e11067b.png)

## 깃허브 리포지토리와 연동

젠킨스 메인 화면에서 `새로운 Item` 을 클릭한다. 그리고 원하는 이름을 입력하고 `Freestyle project` 를 눌러 아이템을 생성한다.

![image](https://user-images.githubusercontent.com/51476083/124434526-f175a880-ddae-11eb-9d2e-71702ce0f53e.png)

만들어진 아이템을 선택해서 `구성` 설정으로 들어가 `소스 코드 관리 섹션`을 수정해준다. 깃허브 리포지토리 URL 을 입력하고, `Credentials` 를 생성해서 선택한다.

![image](https://user-images.githubusercontent.com/51476083/124434750-36014400-ddaf-11eb-8c69-59c0f7bf5ee1.png)

`Kind`는 Username with password 로 설정하고, `Username` 은 자신의 깃허브 ID, `Password`에는 깃허브 계정 비밀번호를 입력한다.

그리고 특정 브랜치에 변경이 일어났을 때 이를 감지할 브랜치를 `Branch to build` 옵션에서 지정해줄 수 있다. 여기서는 `feature` 브랜치를 default로 사용하기 때문에 `*/feature` 와 같이 추가해주었다.

![image](https://user-images.githubusercontent.com/51476083/124434850-56310300-ddaf-11eb-9b85-c11e6669c313.png)

그리고 `빌드 유발 섹션`에서 `Github hook tigger for GITScm polling` 을 선택한다.

![image](https://user-images.githubusercontent.com/51476083/124435112-9b553500-ddaf-11eb-8d37-d9afdc406daa.png)

다음은 깃허브 리포지토리의 `Settings - webhook` 메뉴로 들어간다.

![image](https://user-images.githubusercontent.com/51476083/124435175-af993200-ddaf-11eb-8046-3de097cd099d.png)

`Add webhook` 버튼을 눌러서 `Payload URL` 에 젠킨스가 구동되는 EC2 IP 또는 DNS를 적고, 뒤에 `github/webhook/` 를 붙여준다. Content type은 `application/json` 으로 설정해주고, 나머지는 다음과 같이 기본 설정을 그대로 유지한다.

![image](https://user-images.githubusercontent.com/51476083/124435411-ecfdbf80-ddaf-11eb-81c4-568daf19a9ab.png)

> **반드시 github-webhook 뒤에 `/` 를 붙여줘야 한다!!!**

그럼 다음과 같은 화면이 나오고, 초록색 체크 모양이 뜨면 webhook 생성이 성공적으로 끝났다.

![image](https://user-images.githubusercontent.com/51476083/124435537-0dc61500-ddb0-11eb-8d97-08d7d655b663.png)

이제 실제 코드를 깃허브에 Push 했을 때, 자동으로 EC2에 Pull 이 되는지 확인한다.

변경을 감지할 브랜치로 PR을 날려서 merge 시켜보자. 그럼 젠킨스 아이템의 `Build History` 에 새로운 히스토리가 생긴다. 이를 클릭해서 확인해보면 `Console Output` 에 다음과 같은 결과를 확인할 수 있다.

![image](https://user-images.githubusercontent.com/51476083/124436371-d6a43380-ddb0-11eb-9956-d5cfe72e5b28.png)

누가 Push를 했는지, 그리고 깃허브의 내용을 pull 해서 `/var/lib/jenkins/workspace/CICD-for-knu-cse` 경로에 저장하였음을 알 수 있다.

![image](https://user-images.githubusercontent.com/51476083/124436817-592cf300-ddb1-11eb-9e52-c7d94b6c64ed.png)

성공적으로 CI 를 구축하였다 !

---

# CD 및 쉘 스크립트 실행 구축

**CD : Continuous Deploy)**

CI 를 통해 변경 사항이 있는 서버 코드를 자동으로 EC2로 가져올 수 있었다.

이제 이 코드를 가지고 Gradle을 이용해 실행 파일(Jar)를 만들고 실행 중인 IDLE 상태의 스프링 서버가 이를 실행 시킨다. 이후 Nginx 가 해당 서버를 CURRENT 상태로 가리켜 배포를 완료하도록 한다.

## Gradle 로 실행 파일 만들기

젠킨스 메인 페이지에서 `젠킨스 관리 - Global tool configuration` 설정으로 들어간다.

이후 `Gradle` 섹션을 찾아 `Add Gradle`버튼을 누른다.

![image](https://user-images.githubusercontent.com/51476083/124437503-17507c80-ddb2-11eb-956b-e7f3873fa2dc.png)

나는 그냥 최신 버전의 Gradle 7.1 버전으로 선택했다.

![image](https://user-images.githubusercontent.com/51476083/124437731-5252b000-ddb2-11eb-9112-79f79e0e1e16.png)

다음으로 생성한 젠킨스 아이템으로 들어가 `구성 - Build` 설정으로 들어간다.

그리고 `Add build step - Invoke Gradle Script` 를 선택하여 다음 그림처럼 설정해준다.

![image](https://user-images.githubusercontent.com/51476083/124438000-9fcf1d00-ddb2-11eb-82ca-2bc5e55f2622.png)

다음엔 오른쪽 하단에 있는 `고급..` 버튼을 누르고 다음과 같이 설정 후 저장한다.

![image](https://user-images.githubusercontent.com/51476083/124438081-b8d7ce00-ddb2-11eb-8b8c-5cbf17142200.png)

그러면 CI 과정을 거쳐서 자동으로 `/var/lib/jenkins/workspace/CICD-for-knu-cse/build/libs` 경로에 실행 파일을 생성한다.

## SSH 로 배포 및 쉘 스크립트 실행

`젠킨스 관리 - 플러그인 관리` 로 들어가 `Publish Over SSH` 플러그인을 설치한다.

![image](https://user-images.githubusercontent.com/51476083/124438381-11a76680-ddb3-11eb-98e1-0ba7960a05d2.png)

`젠킨스 관리 - 시스템 설정` 으로 들어가 방금 설치한 `Publish Over SSH` 플러그인 설정을 다음과 같이 구성한다. (가장 아래에 해당 설정이 있다.)

![image](https://user-images.githubusercontent.com/51476083/124438801-9befca80-ddb3-11eb-9b3f-902fc891be13.png)

- `Key` : 서버가 구동 중인 EC2 인스턴스의 `.pem` 파일 내용을 복사해서 붙여넣는다.

- `Hostname` : 서버가 구동 중인 EC2 인스턴스의 IP를 적어준다.

- `Username` : 접속하려는 유저를 적어준다.

- `Remote Directory` : 접속했을 때의 기본 디렉터리를 설정한다.

<br/>

이후 아이템의 `구성 - 빌드 후 조치 추가 - Send build artifacts over SSH` 설정에 들어가서 다음과 같이 설정한다.

![image](https://user-images.githubusercontent.com/51476083/124439200-16b8e580-ddb4-11eb-9f7e-3ee614b73773.png)

- **Source files** : 배포하려는 파일 지정

- **Remove prefix** : 배포하려는 파일이 속해 있는 디렉토리 정보를 제거하기 위해 필요

- **Remote directory** : 배포하려는 디렉토리의 위치

- **Exec command** : ssh 배포 후 실행하는 명령어 - 여기선 `deploy.sh` 를 실행한다.

`/dev/null 2>&1` 는 표준 출력과 표준 입력을 버리는 것이다. 만약 이 내용을 적어주지 않으면, 젠킨스가 쉘 스크립트를 실행한 후 빠져나오지 못하게 되므로 반드시 붙여줘야 한다!

> **주의 사항**
>
> 반드시 Exec command 에 **절대 경로**를 설정해줘야 한다.
>
> 쉘 스크립트 실행 시 스크립트 안에 있는 모든 명령어들은 반드시 절대 경로를 사용해야 한다.

여기까지 설정을 끝마쳤으면 CI/CD 구축을 모두 완료하였다. 이제 타겟 브랜치로 PR을 보내 Merge를 하면 다음 사진처럼 정상적으로 배포 및 실행이 이루어지는 것을 확인할 수 있다.

![image](https://user-images.githubusercontent.com/51476083/124439763-c9894380-ddb4-11eb-8dd2-c4be1f3f3b2c.png)

![image](https://user-images.githubusercontent.com/51476083/124439882-e9b90280-ddb4-11eb-98b2-3c0409546aa8.png)

> 기존에 Nginx는 스프링 프로필 prod1 서버를 가리키고 있었다.
>
> git push 후 CI/CD가 동작하여 IDLE 상태의 prod2 에 변경 사항을 적용한 후, Nginx가 이를 가리키도록 변경하였다.
>
> => **무중단 배포 환경 구축 완료**
