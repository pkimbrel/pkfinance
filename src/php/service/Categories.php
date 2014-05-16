<?php
class Categories {
    private $dataAccess;

    function __construct() {
        $this->dataAccess = DataAccess::getInstance("categories", null);
    }

    public function get() {
        $data = $this->dataAccess->read();
        header('Content-type: application/json');
        echo $data;
    }

    public function put() {
        throw new NotImplemented("Cannot update categories items");
    }

    public function delete() {
        throw new NotImplemented("Cannot delete categories items");
    }
}
?>
