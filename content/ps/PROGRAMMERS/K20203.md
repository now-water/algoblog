# 문제
- [카카오 2020 블라인드. 3번 자물쇠와 열쇠](https://programmers.co.kr/learn/courses/30/lessons/60059)

## 코드

<details><summary> 코드 보기 </summary>

``` java
public class Q60059 {

    static int lock[][], key[][];
    public static void main(String[] args) {
        int key[][] = {
            {0, 0, 0},
            {1, 0, 0},
            {0, 1, 1}
        };
        int lock [][] = {
            {1, 1, 1},
            {1, 1, 0},
            {1, 0, 1}
        };
        System.out.println(solution(key, lock));
    }

    public static boolean solution(int[][] Key, int[][] Lock) {
        key = Key; lock = Lock;
        int exp = key.length - 1;
        for (int x = 0; x < lock.length + exp; x++) {
            for (int y = 0; y < lock.length + exp; y++) {
                for (int r = 0; r < 4; r++) {
                    int newLock[][] = new int[lock.length + 2 * exp][lock.length + 2 * exp];
                    // 원래 lock 의 돌기 부분을 만들어준다.
                    preCover(exp, newLock);
                    // key를 r번 회전하여 newLock 에 끼워본다.
                    coverKey(x, y, r, newLock);
                    // newLock 의 원래 lock 부분이 모두 끼워졌는지 확인한다.
                    if(isMatched(exp, newLock)) return true;
                }
            }
        }
        return false;
    }

    private static boolean isMatched(int exp, int[][] newLock) {
        for (int i = 0; i < lock.length; i++) {
            for (int j = 0; j < lock[0].length; j++) {
                if(newLock[i+exp][j+exp] != 1) return false;
            }
        }
        return true;
    }

    private static void coverKey(int x, int y, int r, int[][] newLock) {
        int len = key.length;
        for (int i = 0; i < len; i++) {
            for (int j = 0; j < len; j++) {
                if(r == 0) newLock[x+i][y+j] += key[i][j];
                else if(r == 1) newLock[x+i][y+j] += key[j][len-i-1];
                else if(r == 2) newLock[x+i][y+j] += key[len-i-1][len-j-1];
                else if(r == 3) newLock[x+i][y+j] += key[len-j-1][i];
            }
        }
    }

    private static void preCover(int exp, int[][] newLock) {
        for (int i = 0; i < lock.length; i++) {
            for (int j = 0; j < lock[0].length; j++) {
                newLock[i+exp][j+exp] = lock[i][j];
            }
        }
    }
}
```

</details>

## ⭐️느낀점⭐️
> 카카오에선 배열 가지고 놀기도 쉽지 않다고 느꼈다. 
>
> 처음에는 상대 좌표로 채울려고 했는데 일부 케이스가 계속 통과되지 않아 그냥 메모리를 팍팍 써서 큰 배열을 하나 잡고 풀었다.

## 풀이 📣
<hr/>

1️⃣ `key` 배열로 `lock`의 일부분을 겹칠 수 있도록 `newLock`을 만들어서 계산한다.

    - newLock 은 상하좌우 모두 key 배열과 1칸이라도 겹치도록 만들어준다.

    - 따라서 크기는 lock.length + 2 * (key.length - 1) 이다. 


2️⃣ `newLock`의 각 위치에서 `key`를 회전시키며 끼워본다.

    - newLock 배열의 원소에 key 값을 더하고, 원래 lock의 범위가 모두 1로 채워지는지 확인한다.

    - 1보다 크면 돌기끼리 부딪힌 상황이고, 0이면 홈끼리 맞닿은 상황이라 판단할 수 있다.


3️⃣ 회전은 다음과 같은 규칙을 적용할 수 있다.

    - 90도 회전마다 좌표값 (x, y) 가 (y, size - x - 1) 로 변한다.


4️⃣ key를 각 위치에서 돌려가며 끼워본 후 원래 lock의 모든 구멍이 채워지면 true를 반환한다.

    - newLock 의 lock 범위의 값이 모두 1이라면 모든 구멍이 채워진 상태로 판단할 수 있다.


## 실수 😅
<hr/>

- 상대좌표로 채워보려고 했는데 일부 케이스를 계속해서 통과하지 못했다.


- 여태 상대 좌표 90도 회전으로만 풀어왔었는데, 일반 배열을 90도 회전시키는 공식도 알 수 있었다. 