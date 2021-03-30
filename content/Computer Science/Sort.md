# Sorting

- In-place 정렬 : 추가적인 메모리 공간을 필요로 하지 않는 정렬 기법.


- Stable 정렬 : 정렬 후에 같은 키 값을 갖는 원소 간에 순서가 바뀌지 않는 정렬 기법. 

## Bubble Sort

> In-place 정렬, Stable 정렬

**서로 인접한 두 원소의 대소를 비교하고, 조건에 맞지 않다면 자리를 교환하며 정렬하는 알고리즘**

구현하기는 쉽지만 매우 비효율적인 정렬 알고리즘.


### 요약

1. 1회전에 첫 번째 원소와 두 번째 원소를, 두 번째 원소와 세 번째 원소를, 세 번째 원소와 네 번째 원소를, … 이런 식으로 (마지막-1)번째 원소와 마지막 원소를 비교하여 조건에 맞지 않는다면 서로 교환한다.
   

2. 1회전을 수행하고 나면 가장 큰 원소가 맨 뒤로 이동하므로 2회전에서는 맨 끝에 있는 원소는 정렬에서 제외되고, 2회전을 수행하고 나면 끝에서 두 번째 원소까지는 정렬에서 제외된다. 이렇게 정렬을 1회전 수행할 때마다 정렬에서 제외되는 데이터가 하나씩 늘어난다

### 공간 복잡도
  
    스왑할 때 사용하는 임시 변수용으로 사용할 여분의 메모리 슬롯 하나만 더 있으면 된다.


### 시간 복잡도

- 최악의 경우
        
    `O(N^2)` : 역순으로 정렬되어 있는 리스트 정렬 시, 순환할 때마다 하나의 원소만 변경한다.


- 최선의 경우

    `O(N)` : 리스트가 이미 정렬되어 있는 경우, 원소의 위치가 변경되지 않는다. 


### 구현

```java
int[] a = {254,3,213,64,75,56,4,324,65,78,9,5,76,3410,8,342,76};
int b;
for(int i = 0 ; i < a.length ; i ++) {
    for(int j = 0 ; j < a.length -i -1 ; j ++) {
        if(a[j] > a[j + 1]) {
            b = a[j];
            a[j] = a[j + 1];
            a[j + 1] = b;
        }
    }
}
```


<hr/>

## Selection Sort

> In-place 정렬, Unstable 정렬

**해당 순서에 원소를 넣을 위치는 이미 정해져 있고, 어떤 원소를 넣을지 선택하는 알고리즘**이다.

Selection Sort와 Insertion Sort를 헷갈려하는 사람들이 종종 있는데, Selection Sort는 배열에서 **해당 자리를 선택하고 그 자리에 오는 값을 찾는 것**이라고 생각하면 편하다.

### 요약

1. 주어진 배열 중에 최소값을 찾는다.

   
2. 그 값을 맨 앞에 위치한 값과 교체한다. (pass)
   

3. 맨 처음 위치를 뺀 나머지 배열을 같은 방법으로 교체한다.

### 공간 복잡도

주어진 배열 안에서 교환(swap)을 통해, 정렬이 수행되므로 O(n) 이다.

### 시간 복잡도

데이터의 개수가 n개라고 했을 때,

- 첫 번째 회전에서의 비교횟수 : 1 ~ (n-1) => n-1

- 두 번째 회전에서의 비교횟수 : 2 ~ (n-1) => n-2

...

- `(n-1) + (n-2) + .... + 2 + 1 => n(n-1)/2`

**최선, 평균, 최악의 경우 시간복잡도는 O(n^2) 으로 동일하다.**

### 구현

```java
void selectionSort(int[] arr) {
    int indexMin, temp;
    for (int i = 0; i < arr.length-1; i++) {        
        indexMin = i;
        for (int j = i + 1; j < arr.length; j++) {  
            if (arr[j] < arr[indexMin]) {           
                indexMin = j;
            }
        }
        // 4. swap(arr[indexMin], arr[i])
        temp = arr[indexMin];
        arr[indexMin] = arr[i];
        arr[i] = temp;
  }
  System.out.println(Arrays.toString(arr));
}
```

<hr/>

## Insertion Sort

> In-place 정렬, Stable 정렬

**2번째 원소부터 시작하여 그 앞(왼쪽)의 원소들과 비교하여 삽입할 위치를 지정한 후, 원소를 뒤로 옮기고 지정된 자리에 자료를 삽입**하여 정렬하는 알고리즘

### 요약

1. 정렬은 2번째 위치(index)의 값을 temp에 저장한다.
   

2. temp와 이전에 있는 원소들과 비교하며 삽입해나간다.
   

3. '1'번으로 돌아가 다음 위치(index)의 값을 temp에 저장하고, 반복한다.


### 공간 복잡도

  `O(N)` : 주어진 배열 안에서 교환을 통해 정렬을 수행하므로 


### 시간 복잡도
  
- 최악의 경우

  `O(N^2)` : 리스트가 역순으로 이미 정렬되어 있는 경우 `(n-1) + (n-2) + (n-3) + ... + 2 + 1 => n*(n-1)/2`
    

- 최선의 경우
   
    `O(N)` : 리스트가 이미 정렬되어 있는 경우, 한 번씩 밖에 비교를 안하기 때문 


### 구현 

```java
void insertionSort(int[] arr){
    for(int index = 1 ; index < arr.length ; index++){ // 1.
        int temp = arr[index];
        int prev = index - 1;
        while( (prev >= 0) && (arr[prev] > temp) ) {    // 2.
            arr[prev+1] = arr[prev];
            prev--;
        }
        arr[prev + 1] = temp;                           // 3.
    }
    System.out.println(Arrays.toString(arr));
}
```

<hr/>

## Quick Sort

> In-place 정렬, Unstable 정렬


`분할 정복(divide and conquer) 방법` 을 통해 주어진 배열을 정렬

> 분할 정복(Divide and Conquer)
> 
> 문제를 작은 2개의 문제로 분리하고 각각을 해결한 다음, 결과를 모아서 원래의 문제를 해결하는 전략이다.
> 

### 요약

1. 배열 가운데서 하나의 원소를 고른다. 이렇게 고른 원소를 `피벗(pivot)` 이라고 한다.
   

2. 피벗 앞에는 피벗보다 값이 작은 모든 원소들이 오고, 피벗 뒤에는 피벗보다 값이 큰 모든 원소들이 오도록 피벗을 기준으로 배열을 둘로 나눈다. 이렇게 배열을 둘로 나누는 것을 `분할(Divide)` 이라고 한다. 분할을 마친 뒤에 피벗은 더 이상 움직이지 않는다.
분할된 두 개의 작은 배열에 대해 재귀(Recursion)적으로 이 과정을 반복한다.
   

3. 재귀 호출이 한번 진행될 때마다 최소한 하나의 원소는 최종적으로 위치가 정해지므로, 이 알고리즘은 반드시 끝난다는 것을 보장할 수 있다


### 시간 복잡도

- 최악의 경우 

    - `O(N^2)` : `피벗 값이 최소나 최대값으로 지정되어 파티션이 나누어지지 않았을 때` - (배열이 오름차순 or 내림차순 정렬되어있을 경우 순환 호출의 깊이 `N`, 각 호출 단계의 비교 연산 `N`)


- 최선의 경우

    - `O(NlogN)` : 정확히 반 씩 분할되어서 순환 호출의 깊이 `log2N`, 각 순환 호출 단계의 비교 연산 `N`


- 평균적으로 `O(NlogN)`


### 공간 복잡도

주어진 배열 안에서 교환(swap)을 통해, 정렬이 수행되므로 `O(N)` 이다.

### 구현

<hr/>

## Merge Sort

> Stable 정렬

### 퀵소트와의 차이점

> 쪼개는 방식은 퀵정렬과 유사
> 
> 퀵정렬 : 우선 피벗을 통해 정렬(partition) → 영역을 쪼갬(quickSort)
>
> 합병정렬 : 영역을 쪼갤 수 있을 만큼 쪼갬(mergeSort) → 정렬(merge)

합병 정렬이라고도 부르며, 분할 정복 방법을 통해 구현

### 요약

1. 리스트의 크기가 반이 되도록 분할해서 크기가 1인 부분 리스트가 될 때 까지 반복한다.


2. `logN` 번 반복했을 때 크기가 1인 부분 리스트가 N개 발생한다.


3. N 개의 원소들을 정렬해서 재조합한다.


### 시간 복잡도

- 최악의 경우

    - `O(NlogN)` : `피벗 값이 최소나 최대값으로 지정되어 파티션이 나누어지지 않았을 때` - (배열이 오름차순 or 내림차순 정렬되어있을 경우 순환 호출의 깊이 `N`, 각 호출 단계의 비교 연산 `N`)


- 최선의 경우

    - `O(NlogN)` : 정확히 반 씩 분할되어서 순환 호출의 깊이 `log2N`, 각 순환 호출 단계의 비교 연산 `N`


- 평균적으로 `O(NlogN)`

### 공간 복잡도

- `O(1)` : 임시 배열에 저장된 결과를 원래 배열에 복사한다.

### 구현

```java
private void solve() {
    int[] array = { 230, 10, 60, 550, 40, 220, 20 };
 
    mergeSort(array, 0, array.length - 1);
 
    for (int v : array) {
        System.out.println(v);
    }
}
 
public static void mergeSort(int[] array, int left, int right) {
    if (left < right) {
        int mid = (left + right) / 2;
 
        mergeSort(array, left, mid);
        mergeSort(array, mid + 1, right);
        merge(array, left, mid, right);
    }
}
 
public static void merge(int[] array, int left, int mid, int right) {
    int[] L = Arrays.copyOfRange(array, left, mid + 1);
    int[] R = Arrays.copyOfRange(array, mid + 1, right + 1);
 
    int i = 0, j = 0, k = left;
    int ll = L.length, rl = R.length;
 
    while (i < ll && j < rl) {
        if (L[i] <= R[j]) {
            array[k] = L[i++];
        } else {
            array[k] = R[j++];
        }
        k++;
    }
 
    while (i < ll) {
        array[k++] = L[i++];
    }
 
    while (j < rl) {
        array[k++] = R[j++];
    }
}
```

이미 `합병의 대상이 되는 두 영역이 각 영역에 대해서 정렬이 되어있기 때문`에 단순히 두 배열을 `순차적으로 비교하면서 정렬`할 수가 있다.


> 합병정렬은 순차적인 비교로 정렬을 진행하므로, LinkedList의 정렬이 필요할 때 사용하면 효율적이다
>
> 임의의 접근을 하는 퀵 정렬에서는 성능이 좋지 않음 -> `LinkedList` 는  삽입, 삭제 연산에서 유용하지만 접근 연산에서는 비효율적이어서 

<hr/>

## Heap Sort

> In-place 정렬, Unstable 정렬

완전 이진 트리를 기본으로 하는 힙(Heap) 자료구조를 기반으로한 정렬 방식

> 완전 이진 트리
>
> 삽입할 때 왼쪽부터 차례대로 추가하는 이진 트리


### 요약

1. 최대 힙을 구성


2. 현재 힙 루트는 가장 큰 값이 존재함. 루트의 값을 마지막 요소와 바꾼 후, 힙의 사이즈 하나 줄임


3. 힙의 사이즈가 1보다 크면 위 과정 반복

### 시간 복잡도

- 최선, 최악, 평균 : `O(NlogN)`

### 공간 복잡도

- `O(1)`

### 구현

```java
private void solve() {
    int[] array = { 230, 10, 60, 550, 40, 220, 20 };
 
    heapSort(array);
 
    for (int v : array) {
        System.out.println(v);
    }
}
 
public static void heapify(int array[], int n, int i) {
    int p = i;
    int l = i * 2 + 1;
    int r = i * 2 + 2;
 
    if (l < n && array[p] < array[l]) {
        p = l;
    }
 
    if (r < n && array[p] < array[r]) {
        p = r;
    }
 
    if (i != p) {
        swap(array, p, i);
        heapify(array, n, p);
    }
}
 
public static void heapSort(int[] array) {
    int n = array.length;
 
    // init, max heap
    for (int i = n / 2 - 1; i >= 0; i--) {
        heapify(array, n, i);
    }
 
    // for extract max element from heap
    for (int i = n - 1; i > 0; i--) {
        swap(array, 0, i);
        heapify(array, i, 0);
    }
}
 
public static void swap(int[] array, int a, int b) {
    int temp = array[a];
    array[a] = array[b];
    array[b] = temp;
}
```

<hr/>

## Counting Sort (계수 정렬)

> Unstable 정렬

- 장점: O(n) 의 시간복잡도


- 단점: 배열 사이즈 N 만큼 돌 때, 증가시켜주는 Counting 배열의 크기가 큼.

### 요약

1. 각 숫자가 몇 번 등장했는지 센다. 
   

2. 등장한 횟수만큼 정렬할 순서대로 값을 넣어준다.

### 시간 복잡도

- `O(n + k)`, k는 배열에서 등장하는 최대값

### 공간 복잡도

- `O(k)`, k 만큼의 배열을 만들어야 함.

### 구현

```java
int arr[5]; 		// [5, 4, 3, 2, 1]
int sorted_arr[5];
// 과정 1 - counting 배열의 사이즈를 최대값 5가 담기도록 크게 잡기
int counting[6];	// 단점 : counting 배열의 사이즈의 범위를 가능한 값의 범위만큼 크게 잡아야 하므로, 비효율적이 됨.

// 과정 2 - counting 배열의 값을 증가해주기.
for (int i = 0; i < arr.length; i++) {
    counting[arr[i]]++;
}
// 과정 3 - counting 배열을 누적합으로 만들어주기. 해당 값의 시작 인덱스 저장
for (int i = 1; i < arr.length; i++) {
    counting[i] += counting[i - 1];
}
// 과정 4 - 해당하는 값의 인덱스에 값을 넣어주기.
for (int i = 0; i <= arr.length - 1; i++) {
    sorted_arr[counting[arr[i]]++] = arr[i];
}
```

<hr/>


## Radix Sort (기수 정렬)

> Stable 정렬

정수형의 낮은자리수부터 비교하여 높은 자리수까지 정렬(digit sort)해 나간다는 것이 기본 개념이다.

> `Count Sort` 는 원소의 범위가 너무 클 경우 빈도수를 저장할 임시 메모리가 많이 필요하고 필요 연산도 증가한다는 단점.
> 
> 기수정렬은 `최하위자리LSD`(least significant digit) 부터 `최상위자리 MSD`(most significant digit)까지 숫자 `0 - 9` 범위에 있는 것만 단계적으로 정렬하기 때문에 그럴 필요가 없다.
> 
> 따라서 counting sort는 정수나 데이터 크기가 작은 경우(range가 작은경우)에 사용하면되고 기수정렬은 counting sort로 하면 비효율적인경우 대안으로 사용하면 된다.


### 요약

- 문자열, 정수 정렬 가능


- 자릿수가 없는 것은 정렬할 수 없음 `ex) 부동 소수점`


- 중간 결과를 저장할 `bucket` 공간이 필요함


### 시간 복잡도

- `O(d * (n + b))` :  d는 최대 자릿수, b는 10 (k와 같으나 10으로 고정되어 있다.)

    > ( Counting Sort의 경우 : O(n + k) 로 배열의 최댓값 k에 영향을 받음 )
  
### 공간 복잡도

- `O(N)`

### 구현

```java
int arr[] = {...};
int n = arr.length;
Queue<Integer> radix[] = new Queue[10]; // 자리수에 대한 큐 배열
for(int i=0; i<10; ++i)
    radix[i] = new LinkedList<>();

int d = getMax(); // 원소 중 가장 큰 수의 최대 자리수 구하기
int div = 1;

while(div <= d){
    
    // 자리수에 따라 큐에 삽입
    for(int i=0; i<n; ++i)
        radix[(arr[i] / div) % 10].add(arr[i]);
    
    // 큐에 들어간 값들을 자리수 크기 순으로 다시 배열에 집어넣는다.
    for (int i = 0, j = 0; i < 10;){
        if (radix[i].size()){
            arr[j++] = radix[i].poll();
        }
        else i++;
    }
    div *= 10;
}
```

마지막에 가장 큰 원소의 자리수로 큐에 저장 후 배열에 다시 저장할 때,

현재 자리 수 보다 작을 때 구해놓은 값의 순서들이 유지된 채로 현재 자리 수에서의 크기 비교를 해서 값을 넣어주기 때문에 정렬이 가능. 