;recursive
(define (cont-frac1 n d k)
  (define (cf i)
    (if (= i k)
        (/ (n i) (d i))
        (/ (n i) (+ (d i) (cf (+ i 1))))))
  (cf 1))


(cont-frac1 (lambda (i) 1.0) (lambda (i) 1.0) 12)

;iterative
(define (cont-frac2 n d k)
  (define (cf res i)
    (if (= i 0)
        res
        (cf (/ (n i) (+ (d i) res)) (- i 1))))
  (cf (/ (n k) (d k)) (- k 1)))

(cont-frac2 (lambda (i) 1.0) (lambda (i) 1.0) 12)

