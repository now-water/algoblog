# 문제
- [스티커 모으기(2)](https://programmers.co.kr/learn/courses/30/lessons/12971?language=java)

## 코드

<details><summary> 코드 보기 </summary>

``` java
public class Q12971 {

    public static void main(String[] args) {
        int arr1[] = {14, 6, 5, 11, 3, 9, 2, 10};
        int arr2[] = {1, 3, 2, 5, 4};


        System.out.println(solution(arr1));
        System.out.println(solution(arr2));
        System.out.println(solution(new int[]{1, 5}));
    }

    public static int solution(int sticker[]) {
        int size = sticker.length;
        if(size == 1) return sticker[0];

        int firstCheckCache[] = new int[size];
        int secondeCheckCache[] = new int[size];

        // 첫 번째 스티커를 뜯었으면 두 번째 스티커는 뜯을 수 없다. 따라서 자동으로 첫 번째 스티커의 값이 된다.
        firstCheckCache[0] = firstCheckCache[1] = sticker[0];
        secondeCheckCache[1] = sticker[1];

        for (int i = 2; i < size; i++) {
            if(i < size - 1) { // 첫 번째 스티커를 뜯었으면 마지막 스티커는 뜯지 못한다.
                firstCheckCache[i] = Math.max(sticker[i] + firstCheckCache[i - 2], firstCheckCache[i - 1]);
            }
            secondeCheckCache[i] = Math.max(sticker[i] + secondeCheckCache[i - 2], secondeCheckCache[i - 1]);
        }
        return Math.max(firstCheckCache[size - 2], secondeCheckCache[size - 1]);
    }
}
```

</details>

## ⭐️느낀점⭐️
> 쉬운듯 어려운 문제였다.. DP를 탑다운으로만 접근하려는 습관을 고쳐야겠다.

## 풀이 📣
<hr/>

1️⃣ 바텀업 방식의 DP 를 설계하여 생각해야 한다.

    - cache[i] = max(i 번째 스티커를 선택하는 경우, i 번째 스티커를 선택하지 않는 경우)


2️⃣ 만약 i 번째 스티커를 선택한다면 i - 1 번째 스티커는 선택할 수 없다.

    - select[i] = cache[i-2] + sticker[i] 


3️⃣ 만약 i 번째 스티커를 선택하지 않는다면 i - 1 번째까지 구한 최대 합을 갖는다.

    - notSelect[i] = cache[i-1]


4️⃣ 첫 번째 스티커와 마지막 번째 스티커는 붙어있으므로, 첫 번째 스티커를 선택하는지 안하는지로 경우를 나눠 계산한다.

    - firstCheckCache : 첫 번째 스티커를 선택한 경우. 

    - secondeCheckCache : 첫 번째 스티커를 선택하지 않고 두 번째 스티커부터 선택한 경우


5️⃣ 첫 번째 스티커를 선택한 경우는 다음과 같다.

    - firstCheckCache[0] = firstCheckCache[1] = sticker[0];

    - 왜냐하면 firstCheckCache 는 첫 번째 스티커를 반드시 포함하는 경우이므로 두 번째 스티커를 선택할 수 없기 때문에 최대값은 첫 번째 스티커만 선택한 경우이기 때문이다.


6️⃣ 첫 번째 스티커를 선택하지 않은 경우는 다음과 같다.

    - secondeCheckCache[0] = 0, secondeCheckCache[1] = sticker[1]

    - 왜냐하면 첫 번째 스티커를 선택하지 않았으므로 secondeCheckCache[0] = 0 이 된다.

    - 그리고 두 번째 스티커를 선택하였으므로 secondeCheckCache[1] = sticker[1] 이다.


7️⃣ 3 번째(i = 2) 스티커부터 선택하는 경우와 선택하지 않는 경우 중 더 큰 값을 선택하며 값을 누적한다.


8️⃣ 최종적으로 값을 누적한 `firstCheckCache[size - 2]`  와 `secondeCheckCache[size - 1]` 중 더 큰 값을 반환한다.

<hr/>

## 실수 😅

- 탑 다운 방식으로 하다가 시간 초과가 발생하였다. 


- 바텀업이 가능하다면 탑다운도 가능할 거 같긴 한데, 첫 스티커를 선택했는지 여부에 따라 마지막 스티커를 선택하고 그에 따른 값을 어떻게 저장할지 모르겠다.


- 바텀업도 떠올리긴 했었는데, i - 2 부터 i = 0 까지 반복문을 돌려야 한다고 잘못 생각했다..
