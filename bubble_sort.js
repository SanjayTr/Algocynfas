async function bubbleSort(myList) {
    for(var i = 0; i < myList.size(); i++) {
        for(var j = myList.size() - 1; j > i; j--) {
            myList.highlightSwap(j);
            await myList.draw();
            if(myList.elemAt(j).getKey() < myList.elemAt(j - 1).getKey()) {
                myList.highlight(j - 1);
                await myList.draw();
                myList.swap(j, j - 1)
                await myList.draw();
            }
            myList.unhighlight(i, j);
            await myList.draw();
        }
    }
}
