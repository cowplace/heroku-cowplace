(define (repeated f n)
  (if (= n 0)
      (lambda (x) x)
      (lambda (x) (f ((repeated f (- n 1)) x)))))

(define (inc x) (+ x 1))
(define (square x) (* x x))