;recursive
(define (f1 n)
  (if (> n 3)
      (+ (f1 (- n 1)) (* 2 (f1 (- n 2))) (* 3 (f1 (- n 3))))
      n))

;iterative
(define (f2-iter v1 v2 v3 count)
  (if (= (- count 1) 0)
      v1
      (f2-iter v2 v3 (+ v3 (* 2 v2) (* 3 v1)) (- count 1))))

(define (f2 n) (f2-iter 1 2 3 n))

;how the state variables should be updated as the process moves from state to state
;v1<-v2
;v2<-v3
;v3<-v4 = (v3 + v2*2 + v1*3)
;v4<-v5....
