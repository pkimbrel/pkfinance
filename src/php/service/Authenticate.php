<?php
class Authenticate {
    function __construct() {
    }

    public function post() {
        $password = file_get_contents("./password.dat");
        $token = @$_REQUEST["token"];
        if ($password == $token) {
            header('Content-type: text/plain');
            setcookie("XSRF-TOKEN", $token, time() + 31536000, "/");
            echo "OK";
        } else {
            throw new NotAuthenticated("I don't know you");
        }
    }
    
    public function get() {
        throw new NotImplemented("Not implemented");
    }

    public function put() {
        throw new NotImplemented("Not implemented");
    }

    public function delete() {
        throw new NotImplemented("Not implemented");
    }
    
}
?>
