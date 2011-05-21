(define (cont-frac n d k)
  (define (cf i)
    (if (= i k)
        (/ (n i) (d i))
        (/ (n i) (+ (d i) (cf (+ i 1))))))
  (cf 1))

(define (tan-cf x k)
  (cont-frac (lambda (i) (if (= i 1)
			     x
			     (- (square x))))
	     (lambda (i) (- (* i 2) 1))
	     k))

(define (square x) (* x x))