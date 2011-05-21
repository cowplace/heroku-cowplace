(define (double x) (+ x x))
(define (halve x) (/ x 2))

(define (fast-mul x y)
  (cond ((= y 0) 0)
	((even? y) (double (fast-mul x (halve y))))
	(else (+ x (fast-mul x (- y 1))))))
