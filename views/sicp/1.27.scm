(define (expmod base exp m)
  (cond ((= exp 0) 1)
	((even? exp)
	 (remainder (square (expmod base (/ exp 2) m))
		    m))
	(else
	 (remainder (* base (expmod base (- exp 1) m))
		    m))))

(define (square x) (* x x))

(define (test n)
  (define (iter a i)
    (cond ((= a n) i)
	  ((= (expmod a n n) a) (iter (+ a 1) (+ i 1)))
	  (else (iter (+ a 1) i))))
  (iter 1 0))