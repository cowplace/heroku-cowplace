(define (timed-prime-test n)
  (newline)
  (display n)
  (start-prime-test n (runtime)))

(define (start-prime-test n start-time)
  (if (prime? n)
      (report-prime (- (runtime) start-time))))

(define (report-prime elapsed-time)
  (display " *** ")
  (display elapsed-time))

(define (prime? n)
  (= n (smallest-divisor n)))

(define (smallest-divisor n)
  (find-divisor n 2))

(define (find-divisor n test-divisor)
  (cond ((> (square test-divisor) n) n)
	((divides? test-divisor n) test-divisor)
	(else (find-divisor n (+ test-divisor 1)))))

(define (divides? a b)
  (= (remainder b a) 0))

(define (square x) (* x x))

(define (search-for-primes n)
  (search-iter n 0 3))

(define (search-iter num count max)
  (cond ((= count max))
	((even? num) (search-iter (+ num 1) count max))
	((prime? num) (timed-prime-test num) (newline) (search-iter (+ num 2)
								    (+ count 1)
								    max))
	(else (search-iter (+ num 2) count max))))