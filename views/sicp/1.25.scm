(define (expmod base exp m)
  (remainder (fast-expt base exp) m))

(define (fast-expt b n)
  (cond ((= n 0) 1)
	((even? n) (square (fast-expt b (/ n 2))))
	(else (* b (fast-expt b (- n 1))))))

(define (even? n)
  (= (remainder n 2) 0))

;本文にあるexpmodは途中の値をつねにbaseで割ったものにし,
;大きくなるのを防いでいる.
;それに対し, このexpmodはbaseのexp乗を一度に計算し,
;その後mで割った剰余を求めているので, 
;途中の多倍長計算の手間が大変になり, 高速素数テストには使えない. 