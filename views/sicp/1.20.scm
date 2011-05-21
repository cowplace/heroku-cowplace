(define (gcd a b)
  (if (= b 0)
      a
      (gcd b (remainder a b))))

;nomal-order evaluation
;40 != 0 -> 
;(gcd 40 (rem 206 40))

;(rem 206 40) != 0 ->
;(gcd (rem 206 40) (rem 40 (rem 206 40)))

;(rem 40 (rem 206 40)) != 0 ->
;(gcd (rem 40 (rem 206 40)) 
;     (rem (rem 206 40) (rem 40 (rem 206 40))))

;(rem (rem 206 40) (rem 40 (rem 206 40))) != 0 ->
;(gcd (rem (rem 206 40) (rem 40 (rem 206 40)))
;     (rem (rem 40 (rem 206 40)) 
;          (rem (rem 206 40) (rem 40 (rem 206 40)))))

;(rem (rem 40 (rem 206 40)) 
;     (rem (rem 206 40) (rem 40 (rem 206 40)))) = 0 ->
;(rem (rem 206 40) (rem 40 (rem 206 40))) -> 2

;applicative-order evaluation
;40 != 0 -> 
;(gcd 40 6)

;6 != 0 ->
;(gcd 6 4)

;4 != 0 ->
;(gcd 4 2)

;2 != 0 ->
;(gcd 2 0)

;0 = 0 -> 2