<?php
class Checking {
    private $dataAccess;

    function __construct($payPeriod) {
        $this->dataAccess = new DataAccess("checking", $payPeriod);
    }

    public function get() {
        $data = $this->dataAccess->read();
        header('Content-type: application/json');
        echo $data;
    }

    public function put() {
    }

    public function delete() {
        throw new NotImplemented("Cannot delete checking items (yet)");
    }
}
?>
