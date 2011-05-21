(define (filtered-accumulate combiner null-value filter term a next b)
  (cond ((> a b) null-value)
	((filter a) (combiner (term a)
			      (filtered-accumulate combiner
						   null-value
						   filter
						   term (next a)
						   next b)))
	(else (filtered-accumulate combiner null-value filter
				   term (next a)
				   next b))))

;a
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
(define (inc x) (+ x 1))

;Inteaval Prime Square Sum
(define (ipss a b)
  (filtered-accumulate + 0 prime? square a inc b))

;b
(define (relative-pro n)
  (define (non-relative? k) (= (gcd k n) 1))
  (define (ident x) x)
  (define (inc x) (+ x 1))
  (filtered-accumulate * 1 non-relative? ident 2 inc n))