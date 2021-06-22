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

### 생명주기

서블릿은 자신만의 생명주기를 가지고 있고, 웹 애플리케이션 컨테이너에서 콘텍스트가 초기화되면 생명주기가 시작된다.

일반적으로 서블릿을 만들 때는 추상클래스 `HttpServlet` 을 상속받아서 만든다.

![image](https://user-images.githubusercontent.com/51476083/110093963-a2a70a80-7dde-11eb-9862-7da4cb92f446.png)

1. 초기화(initialize)

   로드한 서블릿의 인스턴스를 생성하고 리소스를 로드하는 등 클래스 생성자의 초기화 작업과 동일한 역할을 수행한다.

   `init()` 메소드는 초기화에 대흥되는 메서드여서 한 번만 호출된다.

   ```java
   // gradlew appStartWar 실행 후 http://localhost:8080/init 으로 확인 가능
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

2) 서비스(service)

   클라이언트의 요청에 따라서 호출할 메서드를 결정한다.

3. 소멸(destory)

   서블릿이 언로드된다. 언로드는 런타임 오류가 발생하거나 서블릿 컨테이너가 종료되었을 때 발생한다.

   이때 서블릿이 언로드되어 서블릿의 메서드 호출 결과가 정상적으로 표출되지 않는다.

<hr/>

## HTTP 요청과 응답

### GET 요청 처리

서블릿에서는 `doGet` 메서드를 이용해 GET 메서드 방식의 요청을 응답받을 수 있다.

`HttpServletRequest`(요청에 대한 정보) 와 `HttpServletResponse`(브라우저에서 정보를 표현하기 위해 사용) 를 파라미터로 전달받도록 되어 있다.

`InputStream` 과 `OutputStream` 같은 관계이다

```java
@WebServlet(name = "HelloServlet", urlPatterns = {"/helloget"})
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
