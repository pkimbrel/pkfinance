<?php
class Settings {
    private $dataAccess;

    function __construct() {
        $this->dataAccess = new DataAccess("settings", null);
    }

    public function get() {
        $data = $this->dataAccess->read();
        header('Content-type: application/json');
        echo $data;
    }

    public function post() {
        $request_body = file_get_contents('php://input');
        $data = $request_body;

		$this->dataAccess->write($data);
    }
}
?>
