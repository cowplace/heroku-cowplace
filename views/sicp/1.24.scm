(define (timed-prime-test n)
  (newline)
  (display n)
  (start-prime-test n (runtime)))

(define (start-prime-test n start-time)
  (if (fast-prime? n 100)
      (report-prime (- (runtime) start-time))))

(define (report-prime elapsed-time)
  (display " *** ")
  (display elapsed-time))

(define (expmod base exp m)
  (cond ((= exp 0) 1)
	((even? exp)
	 (remainder (square (expmod base (/ exp 2) m))
		    m))
	(else
	 (remainder (* base (expmod base (- exp 1) m))
		    m))))

(define (fermat-test n)
  (define (try-it a)
    (= (expmod a n n) a))
   (try-it (+ 1 (random (- n 1)))))

(define (fast-prime? n times)
  (cond ((= times 0) #t)
	((fermat-test n) (fast-prime? n (- times 1)))
	(else false)))

(define (even? n)
  (= (remainder n 2) 0))

(define (square x) (* x x))

(define (search-for-primes n)
	(search-iter n 0 3))

(define (search-iter num count max)
	(cond ((= count max))
	      ((even? num) (search-iter (+ num 1) count max))
	      ((fast-prime? num 100) (timed-prime-test num) (newline) (search-iter (+ num 2)
								 (+ count 1)
								 max))
	      (else (search-iter (+ num 2) count max))))