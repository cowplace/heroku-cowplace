(define (p) (p))

(define (test x y)
  (if (= x 0)
      0
      y))
; in applicative-order evaluation, drop(?) endless loop.
; in nomal-order evalution, return 0.