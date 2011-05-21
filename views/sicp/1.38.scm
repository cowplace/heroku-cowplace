(define (cont-frac n d k)
  (define (cf i)
    (if (= i k)
        (/ (n i) (d i))
        (/ (n i) (+ (d i) (cf (+ i 1))))))
  (cf 1))

(define (euler k)
  (+ 2
     (cont-frac (lambda (i) 1.0)
		(lambda (i) (if (= (remainder i 3) 2)
				(* 2 (/ (+ i 1) 3))
				1.0))
		k)))
