<?php
class Typeahead {
    private $dataAccess;

    function __construct() {
        $this->dataAccess = new DataAccess("typeahead", null);
    }

    public function get() {
        $data = $this->dataAccess->read();
        header('Content-type: application/json');
        echo $data;
    }

    public function put() {
        throw new NotImplemented("Cannot update typeahead items");
    }

    public function delete() {
        throw new NotImplemented("Cannot delete typeahead items");
    }
}
?>
