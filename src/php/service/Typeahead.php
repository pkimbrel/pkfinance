<?php
class Typeahead {
    private $dataAccess;

    function __construct() {
        $this->dataAccess = DataAccess::getInstance(null, "typeahead", null);
    }

    public function get() {
        $data = $this->dataAccess->read();
        header('Content-type: application/json');
        echo $data;
    }

    public function post() {
        $typeahead = json_decode($this->dataAccess->read(), true);
        
        $request_body = file_get_contents('php://input');
        $typeaheadEntry = json_decode($request_body, true);

        $description = $typeaheadEntry['description'];
		$typeahead[$description] = $typeaheadEntry['data'];
		
		$this->dataAccess->write(json_encode($typeahead));
    }

    public function delete() {
        throw new NotImplemented("Cannot delete typeahead items");
    }
}
?>
