(define (A x y)
  (cond ((= y 0) 0)
	((= x 0) (* 2 y))
	((= y 1) 2)
	(else (A (- x 1)
		 (A x (- y 1))))))

; guile> (A 1 10)
; 1024 
; guile> (A 2 4)
; 65536
; guile> (A 3 3)
; 65536

(define (f n) (A 0 n)) ; means 2+2+2+....

(define (g n) (A 1 n)) ; means 2*2*2*....

(define (h n) (A 2 n)) ; means 2^2^2^....

(define (k n) (* 5 n n)) ; means 5*n^2
