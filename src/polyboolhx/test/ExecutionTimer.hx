package polyboolhx.test;
import haxe.ds.StringMap;

class ExecutionTimer {

    private static var _spans:StringMap<Float> = new StringMap();

    /**
     Start timing the block identified by key
     @param key block identifier
    **/
    static public function start(key:String) {
        _spans.set(key, Date.now().getTime());
    }

    /**
     Trace the elapsed time for the block identified by key.
     @param key block identifier
    **/
    static public function end(key:String):Float {
        var start = _spans.get(key);
        var duration = 0.0;
        if (start != null) {
            duration = Date.now().getTime() - start;
            trace('${key} took ${duration}ms');
        }
        return duration;
    }

}