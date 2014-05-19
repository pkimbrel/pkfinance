<?php
class FileDataAccess extends DataAccess {
    private static $BASE_PATHS = array(
        //"development" => "../../../pkfinance-livedata/data/",
        "development" => "../../test/data/",
        "staging" => "../../test/data/",
        "production" => "../../prod/data/"
    );

    private $basePath = "";

    function __construct($environment, $dataSet, $payPeriod) {
        $this->basePath = FileDataAccess::$BASE_PATHS[$environment];
        parent::__construct($dataSet, $payPeriod);
    }
    
    private function buildFilePath() {
        $dataPath = $this->basePath;
        
        if ($this->payPeriod == null) {
            $dataPath .= $this->dataSet.".json";
        } else {
            $dataPath .= $this->dataSet."/".$this->payPeriod . ".json";
        }
        
        return $dataPath;
    }

    public function read() {
        $fileData = @file_get_contents($this->buildFilePath());
        
		if ($fileData === false) {
			throw new NotFound("Unable to read data for given dataset.");
		}
        return $fileData;
    }

    public function write($data) {
        file_put_contents($this->buildFilePath(), $data);
    }

    public function delete() {
    }
}
?>
