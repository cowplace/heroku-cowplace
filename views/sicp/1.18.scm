(define (double x) (+ x x))
(define (halve x) (/ x 2))

(define (russian-mul x y)
  (r-mul-iter 0 x y))

(define (r-mul-iter value x y)
  (cond ((= y 0) value)
	((even? y) (r-mul-iter value (double x) (halve y)))
	(else (r-mul-iter (+ value x) x (- y 1)))))