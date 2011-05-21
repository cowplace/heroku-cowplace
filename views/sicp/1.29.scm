(define (sum term a next b)
  (if (> a b)
      0
      (+ (term a) (sum term (next a) next b))))

(define (integral f a b dx)
  (define (add-dx x) (+ x dx))
  (* (sum f (+ a (/ dx 2.0)) add-dx b)
     dx))

(define (simpson f a b n)
  (define (p k)
    (define (culc k) (f (+ a (* k (/ (- b a) (* n 2))))))
    (+ (culc (- k 1)) (* 4 (culc k)) (culc (+ k 1))))
  (define (inc k) (+ k 2))
  (* (/ (/ (- b a) (* n 2)) 3) (sum p 1 inc (- (* n 2) 1))))

(define (cube x) (* x x x))