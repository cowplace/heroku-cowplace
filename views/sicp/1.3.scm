(define (square x) (* x x))

(define (square-sum x y)
  (+ (square x)
     (square y)))

(define (=> x y)
  (or (= x y)
      (> x y)))

(define (square-sum-of-larger-2-numbers x y z)
  (cond ((and (=> x z) (=> y z)) (square-sum x y)) ; z is the smallest
	((and (=> x y) (=> z y)) (square-sum x z)) ; y is the samllest
	(else (square-sum y z)))) ;other (x is the smallest)

(define (exer x y z) (square-sum-of-larger-2-numbers x y z))