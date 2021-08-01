---
title: '서블릿'
metaTitle: '만렙 개발자 키우기'
metaDescription: '서블릿의 개념을 정리하였습니다.'
tags: ['Backend']
date: '2021-03-16'
---

# 서블릿

JVM 기반에서 웹 개발을 하기 위한 명세이자 API 이다.

자바를 실행하려면 `JRE(Java Runtime Environment)`가 필요한 것처럼 서블릿을 실행하려면 웹 애플리케이션 컨테이너가 필요하다.

서블릿은 `Java EE(Enterprise Edition)` 에 포함된 스펙 중의 하나로, 자바에서 `HTTP 요청과 응답`을 처리하기 위한 내용들을 담고있다.

## 생명주기

서블릿은 자신만의 생명주기를 가지고 있고, 웹 애플리케이션 컨테이너에서 콘텍스트가 초기화되면 생명주기가 시작된다.

일반적으로 서블릿을 만들 때는 추상클래스 `HttpServlet` 을 상속받아서 만든다.

![image](https://user-images.githubusercontent.com/51476083/110093963-a2a70a80-7dde-11eb-9862-7da4cb92f446.png)

### 1. 초기화(initialize)

   로드한 서블릿의 인스턴스를 생성하고 리소스를 로드하는 등 클래스 생성자의 초기화 작업과 동일한 역할을 수행한다.

   `init()` 메소드는 초기화에 대응되는 메서드여서 한 번만 호출된다.

   `HttpServlet`을 상속하는 모든 서블릿 클래스들에 대한 인스턴스들을 미리 만들고, 요청 URL 과 매핑시켜둔다.

   ```java
   // 실행 후 http://localhost:8080/init 으로 확인 가능
   @WebServlet(
           name = "initServlet", urlPatterns = {"/init"},
           initParams = {@WebInitParam(name = "siteName", value = "jpub")}
   )
   public class InitServlet extends HttpServlet{
       private String myParam = "";

       public void init(ServletConfig servletConfig) throws ServletException{
           System.out.println("init call");
           this.myParam = servletConfig.getInitParameter("siteName");
           System.out.println("입력받은 사이트 명은" + myParam + "입니다.");
       }

       @Override
       protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
           resp.getWriter().println("hello");
       }
   }
   ```

### 2. 서비스(service)

   클라이언트의 요청 URL에 따라서 생성되어 있는 서블릿 인스턴스 중에서 매핑되는 인스턴스를 찾고, 해당 인스턴스에서 호출할 메서드를 결정한다.

### 3. 소멸(destroy)

   서블릿이 언로드된다. 언로드는 런타임 오류가 발생하거나 서블릿 컨테이너가 종료되었을 때 발생한다.

   이때 서블릿이 언로드되어 서블릿의 메서드 호출 결과가 정상적으로 표출되지 않는다.

<hr/>

## HTTP 요청과 응답

### GET 요청 처리

서블릿에서는 `doGet` 메서드를 이용해 GET 메서드 방식의 요청을 응답받을 수 있다.

`HttpServletRequest`(요청에 대한 정보) 와 `HttpServletResponse`(브라우저에서 정보를 표현하기 위해 사용) 를 파라미터로 전달받도록 되어 있다.

`InputStream` 과 `OutputStream` 같은 관계이다

```java
@WebServlet(name = "HelloServlet", urlPatterns = {"/helloget"}) // web.xml 에 <servlet-mapping></servlet-mapping> 안에 포함될 내용들
// ex) <servlet-name>HelloServlet</servlet><url-pattern>/hello</url-pattern>
public class HelloServlet extends HttpServlet {
  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    System.out.println("doGet 메소드 호출");
    resp.setCharacterEncoding("UTF-8");
    PrintWriter writer = resp.getWriter();

    resp.setContentType("text/html");
    writer.println("<html>");
    writer.println("<head><title>jpub java webservice</title></head>");
    writer.println("<body> get 요청 예제입니다. </body>");
    writer.println("</html>");
  }
}
```

### POST 요청 처리

HTTP 메서드의 POST 에 대응하는 서블릿의 `doPost` 메서드를 사용한다

주로 폼에서 데이터를 입력 후 전송할 때 사용. ex. 회원가입, 로그인

```java
// user form
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Title</title>
        <link rel="stylesheet" href="style.css" type="text/css"/>
    </head>
<body>
    <div class="login-card">
        <h1>Log-in</h1><br>
        <form method="post" action="postsend">
            <input type="text" name="user" placeholder="Username">
            <input type="password" name="pwd" placeholder="Password">
            <input type="submit" class="login login-submit" value="login">
        </form>
    </div>
</body>
</html>
```

```java
// 로그인 서블릿
@WebServlet(name = "LoginServlet", urlPatterns = {"/postsend"})
// urlPatterns : form 에서 필드값을 읽기 위해서 form의 action과 일치해야함
public class LoginServlet extends HttpServlet {
  @Override
  protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    System.out.println("doPost 메소드 호출");
    resp.setCharacterEncoding("UTF-8");
    req.setCharacterEncoding("UTF-8");
    PrintWriter writer = resp.getWriter();

    resp.setContentType("text/html");

    String user = req.getParameter("user"); // input 필드의 name 속성값과 여기 파라미터 "user" 가 같아야함.
    String pwd = req.getParameter("pwd");
    writer.println("<html>");
    writer.println("<head><title>Login Servlet</title></head>");
    writer.println("<body>");
    writer.println("전달받은 이름은" + user + "이고" + "<br/>" + "비밀번호는" + pwd + "입니다.");
    writer.println("</body>");
    writer.println("</html>");
  }
}
```

<hr/>

### 멀티파트

멀티파트는 바이너리 데이터 전송을 위해 사용. 별도의 라이브러리 없이 파일 업로드 같은 기능 구현 가능.

<참고>

GET : 데이터를 쿼리스트링 형식으로 전송

POST Application/x-www-form-urlencoded : 데이터를 스트림 형태로 인코딩하여 전달할 때 사용되는 전송 방식

Multipart/form-data : 파일 업로드 시 사용되는 전송 방식

<hr/>

```java
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
  <h1>업로드</h1><br>
    <!-- 파일 전송 시 폼 속성 "multipart/form-data" , input의 type="file" -->
  <form method="post" action="upload" enctype="multipart/form-data"> <!-- action 속성값은 서블릿의 URL 매핑값과 동일하게 설정 -->
      File:
      <input type="file" name="file" id="file">
      업로드할 서버 경로:
      <input type="text" value="c:/upload" name="destination"/>
      <br/>
      <input type="submit" value="upload">
  </form>
</body>
</html>
```

```java
@WebServlet(urlPatterns = "/upload", name = "uploadServlet")
@MultipartConfig(
        fileSizeThreshold = 1024 * 1024 * 2, // 2mb
        maxFileSize = 1024 * 1024 * 10, // 10mb
        maxRequestSize = 1024 * 1024 * 50, //50mb
        location = "c:/upload" //파일저장위치
)
public class UploadServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");
        //경로
        final String path = request.getParameter("destination");
        //파일
        final Part filePart = request.getPart("file"); // 실제 파일에 대한 정보 획득
        //파일이름
        final String fileName = getFileName(filePart);
        final PrintWriter writer = response.getWriter();

        try (OutputStream out = new FileOutputStream(new File(path + File.separator + fileName));
          InputStream filecontent = filePart.getInputStream()) {
            // file 내용을 가져옴.
            int read = 0;
            final byte[] bytes = new byte[1024];

            while ((read = filecontent.read(bytes)) != -1) {
                out.write(bytes, 0, read);
            }

            writer.print("new File: " + fileName + "\n");
            writer.print(path + " 에 생성되었습니다.");

        } catch (FileNotFoundException fne) {
            System.out.println(fne.getMessage());
        }
    }


    private String getFileName(final Part part) {
        final String partHeader = part.getHeader("content-disposition");
        System.out.println("Part Header = {0}" + partHeader);
        for (String content: part.getHeader("content-disposition").split(";")) {
            if (content.trim().startsWith("filename")) {
                return content.substring(
                        content.indexOf('=') + 1).trim().replace("\"", "");
            }
        }
        return null;
    }
}
```

---
# 서블릿 컨테이너

서블릿 컨테이너는 서버를 시작할 때 클래스패스에 있는 클래스 중 `HttpServlet`을 상속하는 클래스를 찾은 후 
`@WebServlet(“/hello”)` 어노테이션의 값을 읽어 `요청 URL(“/hello”)`과 서블릿을 연결하는 Map을 생성한다.

즉, 서블릿 컨테이너의 중요한 역할 중 하나는 `서블릿 클래스의 인스턴스 생성`, `요청 URL과 서블릿 인스턴스 매핑`, `클라이언트 요청에 해당하는 서블릿을 찾은 후 서블릿에 작업을 위임`하는 역할을 한다.

## 제공하는 기능

- 서블릿 생명 주기 관리


- 멀티 스레딩 지원


- 설정 파일을 활용한 보안 관리


- JSP 지원

이러한 기능들을 제공하여 개발자로 하여금 중요한 비즈니스 로직 구현에 집중할 수 있도록 도와준다.

## 서블릿의 생명 주기

1. **서블릿 컨테이너 시작**


2. **클래스패스에 있는 Servlet 인터페이스를 구현하는 서블릿 클래스를 찾는다.**


3. **`@WebServlet` 설정을 통해 요청 URL과 서블릿 매핑**


4. **서블릿 인스턴스 생성**


5. **init() 메소드를 호출해 초기화 및 요청 대기**


6. **클라이언트 요청 발생 시 URL에 해당하는 서블릿을 찾는다.**


7. **service() 메소드 호출하여 작업 위임**


8. **서블릿 컨테이너 종료 시 관리하던 모든 서블릿 소멸 - `destory()` 호출**

<br/>

웹 애플리케이션을 개발하다 보면 컨테이너라는 용어를 접할 기회가 많은데, 컨테이너마다 다양한 기능을 지원하지만 **기본적으로 생명주기를 관리하는 기능을 제공**한다.

컨테이너가 관리하는 객체의 인스턴스는 개발자가 직접 생성하는 인스턴스가 아니다. 컨테이너가 직접 인스턴스를 관리하기 때문에 초기화, 소멸과 같은 작업을 위한 메소드를 인터페이스 규약으로 만들어 놓고 확장할 수 있도록 지원한다. 

---

# 자바로 웹 애플리케이션 만들기

JSP 와 Servlet은 모두 자바로 웹 어플리케이션을 만들기 위한 도구다.

## Servlet(서블릿)

- 확장자가 `.java` 인 파일


- 자바의 일반적인 클래스와 동일한 개념.


- **웹을 다룰 수 있도록 해주는 `HttpServlet` 클래스를 상속받은 클래스를 의미**

> Servlet을 사용해 웹을 만들 경우 화면 인터페이스 구현이 까다롭다.
> 
> 이러한 단점을 보완하기 위해 만든 스크립트 언어가 JSP 이다.


- html 코드를 출력해주기 위해선 IO 입출력처럼 스트림 객체를 생성해 응답할 html 코드를 전부 print 해줘야한다 => `매우 복잡`

```java
@WebServlet("/testServlet") // 엔드포인트 지정
public class testServlet extends HttpServlet {
 
 public testServlet() {
  super();
  // TODO Auto-generated constructor stub
 }

 protected void doGet(HttpServletRequest request, HttpServletResponse response)
   throws ServletException, IOException {
  // TODO Auto-generated method stub
  response.setContentType("text/html; charset=UTF-8");

  String userName = request.getParameter("userName"); // 태그의 name 속성을 파라미터로 넣어준다.
  String userID = request.getParameter("userID");
  String userPwd = request.getParameter("userPwd");
  String userPwdchk = request.getParameter("userPwdchk");


  PrintWriter out = response.getWriter();
  out.print("<html><body>");
  out.print("<h1> 회원 정보 <h1> <br><hr>");
  out.println("이름 : <b>" + userName);
  out.print("<br>");
  out.println("</b>아이디 : <b>" + userID);
  out.print("<br>");
  out.println("</b>비밀번호 : <b>" + userPwd);
  out.print("<br>");
  out.print("</body></html>");
  out.close();
 }
 
 protected void doPost(HttpServletRequest request, HttpServletResponse response)
   throws ServletException, IOException {
     // ...
  doGet(request, response);
 }

}
```

## JSP

Java Server Page

- 확장자가 `.jsp`인 파일


- 기본적으로 html 문서 안에 자바 언어를 삽입해 사용할 수 있도록 해준다.


- 페이지 레이아웃 구성이 힘든 Servlet 을 보완하기 위해 사용


- JSP 파일은 Servlet 파일(.java) 로 변환되고, 이를 컴파일해서 `.class` 파일로 만든 뒤 실행한다.

    - 실행 결과는 자바 언어가 없는 Html 코드

```html
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>WebTest Page</title>
<script type="text/javascript" src="testScript.js"></script>
</head>
<body>
<form method="get" action="testServlet" name="frm">
<h2> 회원 가입 페이지 </h2>

 <label for="userName"> 이름 </label><span style="color:blue;"> * </span>
 <input type="text" id="userName" name="userName"> <br>
 
 <label> 주민등록번호 </label><span style="color:blue;"> * </span>
 <input type="text" id="userNoBir" name="userNoBir"> -
  <input type="password" id="userNoSec" name="userNoSec"> <br>

  <label for="userID"> 아이디 </label><span style="color:blue;"> * </span>
  <input type="text" id="userID" name="userID"> <br>

  <label for="userPwd"> 비밀번호 </label><span style="color:blue;"> * </span>
  <input type="password" id="userPwd" name="userPwd"> <br>

  <label for="userPwdchk"> 비밀번호확인 </label><span style="color:blue;"> * </span>
 <input type="password" id="userPwdchk" name="userPwdchk"> <br>

  <%-- 이런 식으로 JSP 문법 사용해서 자바 코드 삽입 --%>
  <%
  for(int i = 0; i < 10; i++) {
  out.println(i);
  }
  %>
  
</form>
</body>
</html>
```

## 웹 어플리케이션 동작 과정

1. 사용자가 URL(또는 IP)을 통해 WEB 서버를 호출하고 요청사항을 객체(request)에 담아 전송
   

2. WEB 서버는 요청 객체(request)를 받아서 바로 처리하거나 어플리케이션 서버(WAS)로 객체 전달
   

3. WAS 서버는 요청에 대한 내용과 요청 객체(request)를 받아 적절히 처리 (필요시 DB 작업 진행)
   

4. WAS 서버는 처리 후 결과를 응답 객체(response)에 담아 WEB서버로 회신
   

5. WEB 서버는 응답 객체(response)를 다시 사용자에게 회신
   

6. 사용자의 브라우저는 WEB 서버가 보내준 코드를 해석해 화면을 구성하여 출력



## JAVA SE/EE

**JAVA EE (JAVA Standard Edition)**

- `JAVA SE` 의 확장 버전으로, 서버 개발을 위한 추가 기능을 제공하는 플랫폼


- 간단한 응용프로그램과 서버 구축은 `JAVA SE`만으로도 구성이 가능


- `Tomcat` 등의 `WAS` 를 이용하는 서버 개발은 `JAVA EE` 에서 추가로 제공하는 기능을 사용해야 한다.


- JSP와 Servlet을 만들고 실행하는 규칙, EJB(Enterprise JavaBeans)의 분산 컴포넌트, 웹 서비스 규칙 등을 제공한다.


> 서블릿과 JSP 를 구현하는 기능을 **서블릿 컨테이너**라고 한다.


## Apache/Apache Tomcat

- Apache : Web Server


- Apache Tomcat : Web Application Server

    - = `경량 Apache` + `Tomcat`
    

`Apache` 는 웹 서버 전용 기능이고, `Apache Tomcat`은 WAS 기능을 한다.

`Tomcat` 은 WEB/WAS 의 기능을 가진 자바 어플리케이션이며, `JAVA EE` 기반으로 만들어졌다.

**`WAS`는 자바로 만들어진 JSP 와 Servlet 을 구동하기 위한 서블릿 컨테이너 역할을 수행한다.**

**컨테이너란 JSP를 서블릿으로 바꿔서 실행해주는 역할과, 서블릿의 생명주기를 관리하며 웹 환경에서 서블릿이 구동될 수 있도록 해주는 프로그램이다.**
WAS에서 여러 개의 컨테이너를 구성해서 각각 독립적인 서비스로 구동시키는 것도 가능하다. 만약 하나의 WAS에 하나의 컨테이너만 사용한다면 굳이 WAS와 컨테이너를 별도로 나눠서 생각할 필요가 없다.

WAS의 컨테이너는 웹 서버에서 보내준 요청을 가지고 스레드를 생성한다. 그리고 필요한 `JSP`나 `Servlet` 파일을 구동해서 로직을 수행하게 한 뒤 결과로 생성된 응답 객체를 웹 서버에 보내주는 역할을 한다.

![image](https://user-images.githubusercontent.com/51476083/127116155-49e90b6e-0887-4e5f-b4b7-e475861c0fc0.png)

출처 : https://codevang.tistory.com/191


# 요약

> 서블릿 :  HttpServlet을 상속하고, doGet 메소드와 doPost 메소드를 오버라이딩하여 웹을 다룰 수 있도록 하는 자바 클래스(.java 파일)
>
> JSP : Servlet 으로 구성하기 까다로운 페이지 레이아웃을 편하게 만들도록 도와주는 역할.
>
> WAS : 자바로 만들어진 JSP 와 Servlet 을 구동하기 위한 서블릿 컨테이너 역할.
>
> 컨테이너 : JSP를 서블릿으로 바꿔서 실행해주는 역할과 서블릿의 생명주기를 관리하며 웹 환경에서 서블릿이 구동될 수 있도록 해주는 프로그램
>
> WAS 의 컨테이너는 웹 서버에서 보내준 요청을 가지고 스레드를 생성한다. 그리고 필요한 `JSP`나 `Servlet` 파일을 구동해서 로직을 수행하게 한 뒤 결과로 생성된 응답 객체를 웹 서버에 보내주는 역할을 한다. 

