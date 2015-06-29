<?php
class Categories {
    private $dataAccess;

    function __construct() {
        $this->dataAccess = DataAccess::getInstance(null, "categories", null);
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

    public function put() {
        throw new NotImplemented("Cannot update categories items");
    }

    public function delete() {
        throw new NotImplemented("Cannot delete categories items");
    }
}
?>
