<?php
class FixedEvents {
    private $dataAccess;

    function __construct() {
        $this->dataAccess = new DataAccess("fixedEvents", null);
    }

    public function get() {
        $data = $this->dataAccess->read();
        header('Content-type: application/json');
        echo $data;
    }

    public function put() {
        throw new NotImplemented("Cannot update fixed events items");
    }

    public function delete() {
        throw new NotImplemented("Cannot delete fixed events items");
    }
}
?>
