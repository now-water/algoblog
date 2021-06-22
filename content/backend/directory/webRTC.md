---
title: 'WebRTC'
metaTitle: '만렙 개발자 키우기'
order: 5
tags: ['Backend']
date: '2021-04-04'
---

# WebRTC (Web Real-Time Communication)

: 웹 브라우저간에 플러그인의 도움 없이 서로 통신(음성, 영상, 텍스트, 파일)할 수 있도록 설계된 API. P2P 통신에 최적화되어 있다.

### 3가지 클래스에 의해 실시간 데이터 교환이 이루어진다. (대부분 브라우저에서 지원하는 표준 API)

**1. MediaStream (getUserMedia)** <br/>
사용자의 카메라와 마이크 같은 곳의 데이터 스트림에 접근. 애플리케이션이 사용자의 음성, 영상 데이터를 채집해 올 때 자주 사용한다.

**2. RTCPeerConnection** <br/>
암호화 및 대역폭 관리를 하는 기능을 가지고 있고, 오디오 또는 비디오 연결을 담당

**3. RTCDataChannel** <br/>
음성 및 영상 데이터가아닌, json/text 데이터들을 주고받는 채널을 추상화한 API

<hr/>

## webRTC application 수행 과정

> **1. Fetching** <br/>
> 상대 peer 에게 보낼 사용자의 음성 및 영상 데이터를 수집한다.
>
> **2. Signaling** <br/>
> 상대 peer 와 연결을 맺기 위해 상대 peer의 정보를 탐색한다.
>
> **3. Connection** <br/>
> 발견한 peer 와 p2p connection을 맺는다. channel을 열어둔다.
>
> **4. Communication** <br/>
> 개방해놓은 채널을 통해 음성/영상/텍스트 데이터를 주고 받는다.

### 1단계. Fetching

webRTC API 인 `MediaStream`, `getUserMedia` 를 이용해 사용자의 영상 및 음성 정보를 가져온다.

### 2단계. Signaling

Signlaing 단계는 피어와 피어가 서로를 찾을 수 있도록 돕는 중간 매개자 역할을 하는 서버인 Signaling Server 를 필요로 한다.

Signaling 단계는 서로 다른 두 peer (WebRTC Client) 가 Communication 하기 위한 준비단계로, 3가지 종류의 정보를 교환해야 한다.

1. **Network 정보 교환**

   - ICE Framework를 사용해 자신의 ip와 port를 찾는다. <br/>

   - 클라이언트간에 쌍방으로 각자의 `Ice Candidate`(Network 정보)를 확보하여 `Signaling Server`를 통해 상대 peer 에게 serialized 된 `ice candidate` 정보를 전송한다. <br/>

   - 클라이언트간에 쌍방으로 상대 peer 의 네트워크 정보가 도착하면, `RTCPeerConnection.addIceCandidate` 를 통해 상대 peer 의 네트워크 정보를 등록한다.

2. **Media Capability를 교환**

   - `SDP` (Session Description Protocol) 형식을 따르는 blob인 `offer`와 `answer`를 주고 받으며 교환. <br/>

   - 내 브라우저와 상대 peer 브라우저가 사용 가능한 코덱들과 해상도를 찾는다.

3. **Session Control Message 교환**

   - Session(통신연결)의 초기화, 종료.

### 3단계. Connection

`signaling`을 통해 상대 피어의 정보가 잘 등록된 `RTCPeerConnection`을 얻었다면 연결이 성공

### 4단계. Communication

webRTC를 통해 peer와 peer 간에 다음의 데이터들을 주고 받는다.

1. video나 audio 데이터 스트림
2. 직렬화된 text 데이터

연결이 이루어지기 전에 데이터 stream 이나 채널을 미리 준비하고, 연결이 완료되면 데이터를 받았을 때의 callback 을 통해 받은 데이터를 처리한다.

<hr/>

### video나 audio 데이터 스트림의 경우

> **주는 입장** <br/> > `getUserMedia` 등의 api를 통해 `video/audio` 스트림 source를 취득해 `RTCPeerConnection`을 생성할 당시에 `addTrack`(데이터 stream 채널 연결)을 해준다. `Signaling`을 통해 connection이 이루어지기 전에 미리 되어야 한다.

> **받는 입장** <br/> > `RTCPeerConnection.ontrack` 의 callback을 커스텀하게 설정해서, connection이 성공적으로 이루어진 후에 상대방의 `Track(video/audio stream)` 이 감지되면 어떤 동작을 할지 설정할 수 있다.
>
> 보통은 받은 Track의 데이터 스트림을 DOM의 `<video srcObject={???}/> element`에 연결해서 보여준다.

### 직렬화된 text 데이터의 경우

> **주는 입장** <br/> > `RTCPeerConnection.createDataChannel` 을 통해, 특정 이름의 data 전달 채널을 개설할 수 있다. 이 또한 `Signaling` 을 통해 connection 이 이루어지기 전에 미리 되어야한다.

> **받는 입장** <br/> > `RTCPeerConnection.ondatachannel` 의 callback 을 커스텀하게 설정해서, connection 이 성공적으로 이루어진 후에 상대방이 `data channel` 을 통해 어떤 데이터를 보냈을 때의 동작을 설정할 수 있다.

<hr/>

### 참고

[Getting Started With webRTC](https://www.html5rocks.com/ko/tutorials/webrtc/basics/)
