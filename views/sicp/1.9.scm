(define (f1 a b)
  (if (= a 0)
      b
      (inc (f1 (dec a) b)))) ; recursive

(define (f2 a b)
  (if (= a 0)
      b
      (f2 (dec a) (inc b)))) ;iterative

(define (inc x) (+ x 1))

(define (dec x) (- x 1))