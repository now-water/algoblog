# 문제
- [10159. 저울](https://www.acmicpc.net/problem/10159)

## 코드
``` java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Q10159 {
    static int n, m;
    static boolean upLink[][], downLink[][], link[][];
    public static void main(String[] args) throws IOException {
        init();
        solution();
    }

    private static void solution() {
        for (int k = 1; k <= n; k++) {
            for (int i = 1; i <= n; i++) {
                for (int j = 1; j <= n; j++) {
                    if(upLink[i][k] && upLink[k][j])
                        upLink[i][j] = true;

                    if(downLink[i][k] && downLink[k][j])
                        downLink[i][j] = true;
                }
            }
        }

        /* 위-아래 로 모두 연결되어 있는 정보 */
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= n; j++) {
                link[i][j] = (upLink[i][j] | downLink[i][j]);
            }
        }

        for (int i = 1; i <= n; i++) {
            int cnt = 0;
            for (int j = 1; j <= n; j++) {
                if(i == j) continue; // 자기 자신은 제외.
                if(!link[i][j]) // 연결이 불가능한 경우.
                    cnt += 1;
            }
            System.out.println(cnt);
        }
    }

    private static void init() throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        n = stoi(br.readLine());
        m = stoi(br.readLine());
        upLink = new boolean[n + 1][n + 1];
        downLink = new boolean[n + 1][n + 1];
        link = new boolean[n + 1][n + 1];
        for (int i = 0; i < m; i++) {
            StringTokenizer st = new StringTokenizer(br.readLine());
            int u = stoi(st.nextToken());
            int v = stoi(st.nextToken());
            upLink[v][u] = true;
            downLink[u][v] = true;
        }
    }
    private static int stoi(String str) {
        return Integer.parseInt(str);
    }

}
```


## ⭐️느낀점⭐️
> 분리집합으로 접근했으나 실패
> 
> 최단경로 알고리즘도 떠올렸으나 반대방향을 생각할 수 없어서 적용하진 못했다.
> 
> 최단경로 알고리즘을 활용하는 생소한 문제였다. GOOD!!

## 풀이 📣

1️⃣ 입력으로 주어진 관계를 무거운 물체를 향하도록 단방향 간선을 연결해준다.

    - u, v => upLink[v][u] = true


2️⃣ 물체간에 연결 관계는 무거운 물체와 가벼운 물체를 모두 비교하기 때문에 가벼운 물체를 향하는 간선을 저장하는 `boolean downLink[][]` 도 만들어준다. 

    - u, v => downLink[u][v] = true


3️⃣ `upLink` 와 `downLink` 들로 비교할 수 있는 물체들간에 최단경로 알고리즘을 활용해서 모두 표시해준다.

    - 플로이드-와샬 알고리즘을 사용해서 경유할 수 있는 물체를 경유해서 다른 물체와 비교가 가능한지 확인한다.

    - upLink[i][j] : i 와 j 가 무거운 무게 순으로 연결 가능한지 여부

    - downLink[i][j] : i 와 j 가 가벼운 무게 순으로 연결 가능한지 여부


4️⃣ 각 물체에서 비교가능한 물체들을 표시하는 배열 `boolean link[][]` 를 만들어서 저장한다.

    - link[i][j] : upLink[i][j] 와 downLink[i][j] 중 하나라도 연결되어 있으면 그 두 물체는 비교 가능


5️⃣ `link[][]` 를 통해 각 물체별로 비교가 가능하지 않은 물체 `link[i][j] == false` 의 개수를 구해서 출력한다 

## 실수 😅

- 단방향 간선을 양쪽으로 연결할 생각을 못했다..