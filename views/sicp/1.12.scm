;recursive
;;calcuration
(define (calc-pascal no n)
  (cond ((or (< no 1) (> no n)) 0)
	((or (= no 1) (= no n)) 1)
	(else (+ (calc-pascal (- no 1) (- n 1)) (calc-pascal no (- n 1))))))

;print
(define (print n) (print-pascal n 1 1))

(define (print-pascal n num count)
  (cond ((> count n) (newline))
	((> num count) (newline) (print-pascal n 1 (+ count 1)))
	(else ((calc-pascal num count) (print-pascal n (+ num 1) count)))))
