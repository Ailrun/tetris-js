;;; Directory Local Variables
;;; For more information see (info "(emacs) Directory Variables")

((nil
  (create-lockfiles)
  (eval progn
        (let
            ((base-path
              (locate-dominating-file default-directory ".dir-locals.el")))
          (setq-local backup-directory-alist
                      `((,(expand-file-name ".*" base-path)
                         \,
                         (expand-file-name ".backup" base-path))))
          (make-local-variable 'exec-path)
          (add-to-list 'exec-path
                       (expand-file-name "node_modules/.bin/" base-path)))))
 (css-mode
  (css-indent-offset . 2))
 (js2-mode
  (js2-additional-externs list
                          ("require"))
  (js2-strict-inconsistent-return-warning)
  (js2-strict-missing-semi-warning)
  (js2-strict-trailing-comma-warning)
  (js2-bounce-indent-p . t)
  (js-indent-level . 2)))







