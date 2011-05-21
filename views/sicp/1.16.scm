(define (fast-expt2 b n)
  (f-iter 1 b n))

(define (f-iter a b n)
  (cond ((= n 0) a)
	((= b 1) 1)
	((even? n) (f-iter a (square b) (half n)))
	(else (f-iter (* a b) b (- n 1)))))

(define (even? n) (= (remainder n 2) 0))
(define (square x) (* x x))
(define (half n) (/ n 2))