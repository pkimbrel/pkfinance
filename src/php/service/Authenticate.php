<?php
class Authenticate {
    function __construct() {
    }

    public function post() {
        $token = @$_REQUEST["token"];
        if ("abc123" == $token) {
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
